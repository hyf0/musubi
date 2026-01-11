export async function useWebsiteConfig() {
  const ret = await useAsyncData(async () => {
    const { default: websiteConfig } = await import('~~/knot.config')
    return websiteConfig
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
