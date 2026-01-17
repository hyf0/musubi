import { neverCallable } from '~/utils/neverCallable'
import { NAVBAR_DATA_KEY } from '~/utils/keysForUseAsyncData'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

export async function useNavbarData() {
  return await useBuildAsyncData(
    NAVBAR_DATA_KEY,
    import.meta.server
      ? async () => {
          const { Website } = await import('~~/app/server/website/Website')
          const { resolveWebsiteConfig } = await import(
            '~~/app/server/website/resolveWebsiteConfig'
          )
          const website = Website.getInstance()
          const [contentPages, config] = await Promise.all([
            website.getContentPages(),
            resolveWebsiteConfig(),
          ])
          return {
            contentPages: contentPages.map((page) => ({
              title: page.title,
              slug: page.slug,
            })),
            social: config.social,
          }
        }
      : neverCallable,
  )
}
