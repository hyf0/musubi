import { useRoute, useAsyncData, createError } from '#imports'
import { neverCallable } from '~/utils/neverCallable'

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

  const ret = await useAsyncData(
    `content-page-${slug}`,
    import.meta.server
      ? async () => {
          const { Website } = await import('~~/app/server/website/Website')
          const website = Website.getInstance()
          const page = await website.getContentPageBySlug(slug)
          return page
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
