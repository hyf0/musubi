import { useRoute, useAsyncData, createError } from '#imports'
import { createPostDataKey } from '~/utils/keysForUseAsyncData'

export async function usePostData() {
  const route = useRoute()
  const slug = route.params.slug

  if (typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: `Expected 'slug' to be a string, but got ${typeof slug}`,
      fatal: true,
    })
  }

  const ret = await useAsyncData(createPostDataKey(slug), async () => {
    const { Website } = await import('~~/app/server/website/Website')
    const website = Website.getInstance()
    const post = await website.getPostBySlug(slug)
    return post
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
