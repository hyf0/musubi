import { resolveKnotConfig } from '~~/shared/website/resolveKnotConfig'

export async function useWebsiteConfig() {
  const ret = await useAsyncData(async () => {
    return await resolveKnotConfig()
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
