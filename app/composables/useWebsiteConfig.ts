import { useAsyncData, createError } from '#imports'
import { WEBSITE_CONFIG_KEY } from '~/utils/keysForUseAsyncData'
import { neverCallable } from '~/utils/neverCallable'

export async function useWebsiteConfig() {
  const ret = await useAsyncData(
    WEBSITE_CONFIG_KEY,
    import.meta.server
      ? async () => {
          const { resolveWebsiteConfig } = await import(
            '~~/app/server/website/resolveWebsiteConfig'
          )
          return await resolveWebsiteConfig()
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
