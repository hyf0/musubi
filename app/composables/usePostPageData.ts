import { useRoute, createError } from '#imports'
import { neverCallable } from '~/utils/neverCallable'
import { createPostPageDataKey } from '~/utils/keysForUseAsyncData'
import { useBuildAsyncData } from '~/composables/useBuildAsyncData'

export async function usePostPageData() {
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
    createPostPageDataKey(slug),
    import.meta.server
      ? async () => {
          const { Website } = await import('~~/app/server/website/Website')
          const { resolveWebsiteConfig } = await import(
            '~~/app/server/website/resolveWebsiteConfig'
          )
          const website = Website.getInstance()
          const [post, config] = await Promise.all([
            website.getPostBySlug(slug),
            resolveWebsiteConfig(),
          ])
          return {
            websiteTitle: config.title,
            post,
          }
        }
      : neverCallable,
  )
}
