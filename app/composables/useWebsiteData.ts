import { Website } from '~~/shared/website/Website'
import websiteConfig from '~~/knot.config'

export async function useWebsiteData() {
  const ret = await useAsyncData(async () => {
    const website = Website.getInstance()
    const [postMetaList, contentPages] = await Promise.all([
      website.getPostMetaList(),
      website.getContentPages(),
    ])
    return {
      postMetaList,
      contentPages,
      config: websiteConfig,
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
