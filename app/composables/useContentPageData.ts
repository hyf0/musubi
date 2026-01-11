import { Website } from '~~/shared/website/Website'

export async function useContentPageData() {
  const route = useRoute()
  const slug = route.params.slug

  if (typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: `Expected 'slug' to be a string, but got ${typeof slug}`,
      fatal: true,
    })
  }

  const ret = await useAsyncData(`content-page-${slug}`, async () => {
    const website = Website.getInstance()
    const page = await website.getContentPageBySlug(slug)
    return page
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
