import { NotionDatabasePage } from './NotionDatabasePage'
import { NotionStandalonePage } from './NotionStandalonePage'

export class KnotConfigPage extends NotionDatabasePage {
  /**
   * Parse the Name/Value database rows into a plain object
   * Values are JSON.parsed if valid, otherwise kept as raw strings
   *
   * @returns Plain object with parsed values
   * @throws Only on Notion API failure (network error, invalid page ID, etc.)
   */
  async toObject(): Promise<Record<string, unknown>> {
    const childIds = await this.childPageIds()

    const configMap = new Map<string, unknown>()

    for (const pageId of childIds) {
      const row = new NotionStandalonePage(pageId)
      const name = await row.getProp('Name')
      const value = await row.getProp('Value')
      const type = await row.getProp('Type')

      if (typeof name === 'string' && typeof value === 'string') {
        let parsedValue: unknown
        if (type === 'JSON') {
          try {
            parsedValue = JSON.parse(value)
          } catch {
            // Invalid JSON, keep as raw string
            parsedValue = value
          }
        } else {
          // String type or unspecified - keep as raw string
          parsedValue = value
        }
        configMap.set(name, parsedValue)
      }
    }

    return Object.fromEntries(configMap)
  }
}
