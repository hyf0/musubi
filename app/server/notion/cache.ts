import { compress, decompress } from 'compress-json'
import type { ExtendedRecordMap } from 'notion-types'

// Clear cache directory when UPDATE_TEST_CACHE=1 (awaited before first write)
const cacheCleared =
  process.env.UPDATE_TEST_CACHE === '1'
    ? import('node:fs').then(({ existsSync, rmSync }) => {
        const dir = `${process.cwd()}/.test-cache`
        if (existsSync(dir)) {
          rmSync(dir, { recursive: true })
        }
      })
    : Promise.resolve()

export function shouldUseTestCache(): boolean {
  return process.env.USE_TEST_CACHE === '1'
}

export function shouldUpdateTestCache(): boolean {
  return process.env.UPDATE_TEST_CACHE === '1'
}

function getCacheDir(): string {
  return `${process.cwd()}/.test-cache`
}

function getCachePath(pageId: string): string {
  return `${getCacheDir()}/${pageId}.json`
}

export async function readCache(pageId: string): Promise<ExtendedRecordMap | null> {
  const { existsSync, readFileSync } = await import('node:fs')
  const cachePath = getCachePath(pageId)
  if (!existsSync(cachePath)) {
    return null
  }
  const content = readFileSync(cachePath, 'utf-8')
  return decompress(JSON.parse(content)) as ExtendedRecordMap
}

export async function writeCache(pageId: string, data: ExtendedRecordMap): Promise<void> {
  await cacheCleared
  const { existsSync, mkdirSync, writeFileSync } = await import('node:fs')
  const cachePath = getCachePath(pageId)
  const dir = getCacheDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(cachePath, JSON.stringify(compress(data)))
}
