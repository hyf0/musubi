import { WEBSITE_DATA_KEY } from '~/utils/keysForUseAsyncData'

export async function useWebsiteData() {
  const ret = await useAsyncData(WEBSITE_DATA_KEY, async () => {
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
  })

  if (ret.error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: ret.error.value.message,
      fatal: true,
    })
  }

  return ret
}
