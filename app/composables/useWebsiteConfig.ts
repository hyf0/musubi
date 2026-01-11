import { resolveWebsiteConfig } from '~~/shared/website/resolveWebsiteConfig'

export async function useWebsiteConfig() {
  const ret = await useAsyncData(async () => {
    return await resolveWebsiteConfig()
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
