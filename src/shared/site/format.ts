import type { SiteConfig } from './types.ts'

export type PublishedDateStyle = 'full' | 'month-day'

function parsePublishedDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`)
}

export function formatPublishedDate(
  value: string,
  config: SiteConfig,
  style: PublishedDateStyle = 'full',
): string {
  const date = parsePublishedDate(value)
  const dateOptions: Intl.DateTimeFormatOptions =
    style === 'month-day'
      ? { month: 'short', day: 'numeric', timeZone: 'UTC' }
      : { dateStyle: 'medium', timeZone: 'UTC' }
  return new Intl.DateTimeFormat(config.language, dateOptions).format(date)
}

export function formatPublishedYear(value: string, config: SiteConfig): string {
  const date = parsePublishedDate(value)
  return new Intl.DateTimeFormat(config.language, {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}