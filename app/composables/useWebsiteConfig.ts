import { WEBSITE_CONFIG_KEY } from '~/utils/keysForUseAsyncData'
import { neverCallable } from '~/utils/neverCallable'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

export async function useWebsiteConfig() {
  return await useBuildAsyncData(
    WEBSITE_CONFIG_KEY,
    import.meta.server
      ? async () => {
          const { resolveWebsiteConfig } =
            await import('~~/app/server/website/resolveWebsiteConfig')
          return await resolveWebsiteConfig()
        }
      : neverCallable,
  )
}
