import { describe, expect, it } from 'vite-plus/test'
import { formatPublishedDate, formatPublishedYear } from './format.ts'
import type { SiteConfig } from './types.ts'

const config: SiteConfig = {
  title: 'Musubi',
  description: '',
  author: 'Musubi Team',
  siteUrl: 'https://example.com',
  language: 'en',
  github: '',
  x: '',
}

describe('publication date formatting', () => {
  it('formats the normalized calendar date without timezone behavior', () => {
    expect(formatPublishedDate('2026-07-14', config, 'month-day')).toBe('Jul 14')
    expect(formatPublishedYear('2026-07-14', config)).toBe('2026')
  })

  it('uses Config Language for localized output', () => {
    const chinese = { ...config, language: 'zh-CN' }
    expect(formatPublishedDate('2026-07-14', chinese, 'month-day')).toBe('7月14日')
    expect(formatPublishedYear('2026-07-14', chinese)).toBe('2026年')
  })
})