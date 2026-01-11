import type { KnotConfig } from './types/WebsiteConfig'
import { KnotConfigPage } from '../../shared/notion/KnotConfigPage'

export async function resolveKnotConfig(): Promise<KnotConfig> {
  const configPageId = process.env.NOTION_CONFIG_PAGE_ID

  // If no remote config is configured, use local config
  if (!configPageId) {
    const { default: localConfig } = await import('../../knot.config')
    return localConfig
  }

  // Fetch and return remote config (errors propagate)
  const configPage = new KnotConfigPage(configPageId)
  return (await configPage.toObject()) as KnotConfig
}
