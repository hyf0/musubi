import { Website } from '~~/shared/website/Website'

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
