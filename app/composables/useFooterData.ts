import { neverCallable } from '~/utils/neverCallable'
import { FOOTER_DATA_KEY } from '~/utils/keysForUseAsyncData'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

export async function useFooterData() {
  return await useBuildAsyncData(
    FOOTER_DATA_KEY,
    import.meta.server
      ? async () => {
          const { resolveWebsiteConfig } = await import(
            '~~/app/server/website/resolveWebsiteConfig'
          )
          const config = await resolveWebsiteConfig()
          return {
            author: config.author,
          }
        }
      : neverCallable,
  )
}
