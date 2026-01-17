import { WEBSITE_DATA_KEY } from '~/utils/keysForUseAsyncData'
import { neverCallable } from '~/utils/neverCallable'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

export async function useWebsiteData() {
  return await useBuildAsyncData(
    WEBSITE_DATA_KEY,
    import.meta.server
      ? async () => {
          const { Website } = await import('~~/app/server/website/Website')
          const website = Website.getInstance()
          const [postMetaList, contentPages] = await Promise.all([
            website.getPostMetaList(),
            website.getContentPages(),
          ])
          return {
            postMetaList,
            contentPages,
          }
        }
      : neverCallable,
  )
}
