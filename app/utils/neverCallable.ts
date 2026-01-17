import type { NuxtApp } from '#app'

export type AsyncDataHandler<T> = (nuxtApp: NuxtApp, options: { signal: AbortSignal }) => Promise<T>

/**
 * A placeholder for useAsyncData handlers on client side.
 * Used with inline `import.meta.server` conditional to enable tree-shaking.
 *
 * @example
 * useAsyncData(key, import.meta.server ? async () => { ... } : neverCallable)
 */
export const neverCallable = (() => {
  throw new Error('[neverCallable] This should never be called on client')
}) as unknown as AsyncDataHandler<never>
