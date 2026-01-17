import { useAsyncData, createError } from '#imports'
import { WEBSITE_DATA_KEY } from '~/utils/keysForUseAsyncData'
import { neverCallable } from '~/utils/neverCallable'

export async function useWebsiteData() {
  const ret = await useAsyncData(
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

  if (ret.error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: ret.error.value.message,
      fatal: true,
    })
  }

  return ret
}
