import { useRoute, createError } from '#imports'
import { neverCallable } from '~/utils/neverCallable'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

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

  return await useBuildAsyncData(
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
}
