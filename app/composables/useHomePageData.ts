import { neverCallable } from '~/utils/neverCallable'
import { HOME_PAGE_DATA_KEY } from '~/utils/keysForUseAsyncData'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

export async function useHomePageData() {
  return await useBuildAsyncData(
    HOME_PAGE_DATA_KEY,
    import.meta.server
      ? async () => {
          const { Website } = await import('~~/app/server/website/Website')
          const { resolveWebsiteConfig } = await import(
            '~~/app/server/website/resolveWebsiteConfig'
          )
          const website = Website.getInstance()
          const [postMetaList, config] = await Promise.all([
            website.getPostMetaList(),
            resolveWebsiteConfig(),
          ])
          return {
            websiteTitle: config.title,
            posts: postMetaList.map((post) => ({
              title: post.title,
              slug: post.slug,
              date: post.date,
            })),
          }
        }
      : neverCallable,
  )
}
