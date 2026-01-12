import { resolveWebsiteConfig } from './app/server/website/resolveWebsiteConfig'

const websiteConfig = await resolveWebsiteConfig()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@unocss/nuxt', 'unplugin-icons/nuxt', '@nuxtjs/color-mode'],
  devtools: { enabled: true },
  ssr: true,
  typescript: {
    strict: true,
    typeCheck: true,
    sharedTsConfig: {
      include: ['../website.config.ts'],
    },
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    ssr: {
      noExternal: ['react-tweet'],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: true,
    },
  },
  experimental: {
    // Caution:
    // - When enable `sharedPrerenderData`, must pass string key to `useAsyncData` to avoid data collision.
    // - When not passing string key to `useAsyncData`, nuxt will auto generate a key based on file path, which may cause data collision in some cases.
    // - https://github.com/nuxt/nuxt/blob/9094bb11213012bd6161fd8127984d08a5c588a3/packages/nuxt/src/core/plugins/keyed-functions.ts
    sharedPrerenderData: true,
    // While pre-rendered `useAsyncData` won't run the internal fetcher on the client side, it still references server-side code,
    // which increases the client bundle size. Enabling `extractAsyncDataHandlers` will extract the handlers to a separate chunk,
    // though server-side code still exists in the client bundle, but it wouldn't get downloaded anymore.
    extractAsyncDataHandlers: true,
  },
  app: {
    head: {
      title: websiteConfig.title, // default fallback title
      meta: [{ name: 'description', content: websiteConfig.description }],
    },
  },
})
