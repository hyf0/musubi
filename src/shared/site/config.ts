import type { SiteConfig, SourceConfigRow } from './types.ts'

export const defaultSiteConfig: SiteConfig = {
  title: 'Musubi',
  description: 'A personal website published from Notion.',
  author: 'Musubi',
  siteUrl: 'https://example.com/',
  language: 'en',
  github: '',
  x: '',
}

const configKeys = {
  'Site title': 'title',
  'Site description': 'description',
  Author: 'author',
  'Site URL': 'siteUrl',
  Language: 'language',
  GitHub: 'github',
  'X (Twitter)': 'x',
} as const

type ConfigKey = keyof typeof configKeys

function parseNonempty(value: string, row: SourceConfigRow): string {
  const normalized = value.trim()
  if (!normalized) {
    throw new Error(`${row.sourceLabel}: ${row.key} must be a nonempty string`)
  }
  return normalized
}

function parseUrl(value: string, row: SourceConfigRow): string {
  const normalized = parseNonempty(value, row)
  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    throw new Error(`${row.sourceLabel}: ${row.key} must be an absolute HTTP(S) URL`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`${row.sourceLabel}: ${row.key} must use HTTP or HTTPS`)
  }
  return url.toString()
}

function parseSiteUrl(value: string, row: SourceConfigRow): string {
  const parsed = new URL(parseUrl(value, row))
  if (parsed.username || parsed.password || parsed.href !== `${parsed.origin}/`) {
    throw new Error(
      `${row.sourceLabel}: Site URL must be an origin URL without credentials, a folder path, a query, or a fragment`,
    )
  }
  return parsed.toString()
}

function parseLanguage(value: string, row: SourceConfigRow): string {
  const normalized = parseNonempty(value, row)
  try {
    const [language] = Intl.getCanonicalLocales(normalized)
    if (!language) {
      throw new Error('missing canonical language')
    }
    return language
  } catch {
    throw new Error(`${row.sourceLabel}: Language must be a valid BCP 47 language tag`)
  }
}

function parseConfigValue(
  key: ConfigKey,
  row: SourceConfigRow,
): SiteConfig[(typeof configKeys)[ConfigKey]] {
  switch (key) {
    case 'Site title':
    case 'Site description':
    case 'Author':
      return parseNonempty(row.value, row)
    case 'GitHub':
    case 'X (Twitter)':
      return parseUrl(row.value, row)
    case 'Site URL':
      return parseSiteUrl(row.value, row)
    case 'Language':
      return parseLanguage(row.value, row)
  }
}

function isConfigKey(key: string): key is ConfigKey {
  return Object.hasOwn(configKeys, key)
}

export function resolveSiteConfig(rows: SourceConfigRow[]): SiteConfig {
  const resolved: SiteConfig = { ...defaultSiteConfig }
  const seen = new Map<ConfigKey, SourceConfigRow>()

  for (const row of rows) {
    if (!row.enabled) {
      continue
    }
    if (!isConfigKey(row.key)) {
      throw new Error(`${row.sourceLabel}: unknown enabled Config key ${JSON.stringify(row.key)}`)
    }
    const key = row.key
    const previous = seen.get(key)
    if (previous) {
      throw new Error(
        `${row.sourceLabel} conflicts with ${previous.sourceLabel}: duplicate enabled Config key ${key}`,
      )
    }
    seen.set(key, row)

    if (!row.value.trim()) continue

    const field = configKeys[key]
    const value = parseConfigValue(key, row)
    Object.assign(resolved, { [field]: value })
  }

  return resolved
}