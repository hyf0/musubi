import type { WebsiteConfig } from './types/WebsiteConfig'
import { ConfigPage } from '../musubi-notion/ConfigPage'

export async function resolveWebsiteConfig(): Promise<WebsiteConfig> {
  const configPageId = process.env.NOTION_CONFIG_PAGE_ID

  // If no remote config is configured, use local config
  if (!configPageId || process.env.NUXT_PREPARE) {
    const { default: localConfig } = await import('../../../website.config')
    return localConfig
  }

  // Fetch and return remote config (errors propagate)
  const configPage = new ConfigPage(configPageId)
  return (await configPage.toObject()) as WebsiteConfig
}
