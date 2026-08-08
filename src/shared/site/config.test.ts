import { describe, expect, it } from 'vite-plus/test'

import { resolveSiteConfig } from './config.ts'

describe('site configuration', () => {
  it('uses the selected product defaults when rows are absent', () => {
    const config = resolveSiteConfig([])

    expect(config).toEqual({
      title: 'Musubi',
      description: 'A personal website published from Notion.',
      author: 'Musubi',
      siteUrl: 'https://example.com/',
      language: 'en',
      github: '',
      x: '',
    })
  })

  it('resolves all canonical keys', () => {
    const config = resolveSiteConfig([
      row('Site title', 'My site'),
      row('Site description', 'A small place on the web'),
      row('Author', 'Yunfei He'),
      row('Site URL', 'https://hyf.me'),
      row('Language', 'zh-cn'),
      row('GitHub', 'https://github.com/hyfdev'),
      row('X (Twitter)', 'https://x.com/hyfdev'),
    ])

    expect(config).toEqual({
      title: 'My site',
      description: 'A small place on the web',
      author: 'Yunfei He',
      siteUrl: 'https://hyf.me/',
      language: 'zh-CN',
      github: 'https://github.com/hyfdev',
      x: 'https://x.com/hyfdev',
    })
  })

  it('treats disabled and empty rows as no explicit value', () => {
    const config = resolveSiteConfig([
      row('Site title', 'Stored title', false),
      row('Site description', ''),
      row('GitHub', ''),
      row('X (Twitter)', 'https://x.com/hyfdev', false),
    ])

    expect(config.title).toBe('Musubi')
    expect(config.description).toBe('A personal website published from Notion.')
    expect(config.github).toBe('')
    expect(config.x).toBe('')
  })

  it('rejects duplicate enabled keys even when one value is empty', () => {
    expect(() => resolveSiteConfig([row('Site title', ''), row('Site title', 'Two')])).toThrow(
      'duplicate enabled Config key Site title',
    )
  })

  it.each([
    'Site Title',
    'Site Description',
    'X(Twitter)',
    'Title',
    'Description',
    'Link',
    'Lang',
    'Timezone',
    'Since',
    'PostsPerPage',
  ])('rejects removed Config key %s', (key) => {
    expect(() => resolveSiteConfig([row(key, 'value')])).toThrow('unknown enabled Config key')
  })

  it.each([
    'https://example.com/folder',
    'https://example.com/?query=yes',
    'https://example.com/?',
    'https://example.com/#fragment',
    'https://example.com/#',
    'https://user@example.com/',
  ])('rejects non-origin Site URL %s', (value) => {
    expect(() => resolveSiteConfig([row('Site URL', value)])).toThrow(
      'Site URL must be an origin URL',
    )
  })

  it('rejects invalid canonical nonempty values', () => {
    expect(() => resolveSiteConfig([row('Language', 'not_a_language')])).toThrow(
      'Language must be a valid BCP 47 language tag',
    )
  })
})

function row(key: string, value: string, enabled = true) {
  return {
    sourceLabel: `Config ${key}`,
    key,
    value,
    enabled,
  }
}