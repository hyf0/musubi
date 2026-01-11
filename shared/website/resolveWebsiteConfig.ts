import type { WebsiteConfig } from './types/WebsiteConfig'
import { WebsiteConfigPage } from '../../shared/notion/WebsiteConfigPage'

export async function resolveWebsiteConfig(): Promise<WebsiteConfig> {
  const configPageId = process.env.NOTION_CONFIG_PAGE_ID

  // If no remote config is configured, use local config
  if (!configPageId) {
    const { default: localConfig } = await import('../../website.config')
    return localConfig
  }

  // Fetch and return remote config (errors propagate)
  const configPage = new WebsiteConfigPage(configPageId)
  return (await configPage.toObject()) as WebsiteConfig
}
