import { useAsyncData, createError } from '#imports'
import type { AsyncDataHandler } from '~/utils/neverCallable'

export async function useBuildAsyncData<T>(key: string, handler: AsyncDataHandler<T>): Promise<T> {
  const ret = await useAsyncData(key, handler)

  if (ret.error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: `[useBuildAsyncData] Failed to fetch data for key "${key}": ${ret.error.value.message}`,
      fatal: true,
    })
  }

  if (ret.data.value == null) {
    throw createError({
      statusCode: 500,
      statusMessage: `[useBuildAsyncData] Data for key "${key}" is null. This should not happen during static site generation.`,
      fatal: true,
    })
  }

  return ret.data.value as T
}
