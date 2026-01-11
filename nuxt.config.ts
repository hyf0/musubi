import tailwindcss from '@tailwindcss/vite'
import websiteConfig from './knot.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['unplugin-icons/nuxt', '@nuxtjs/color-mode'],
  devtools: { enabled: true },
  ssr: true,
  typescript: {
    strict: true,
    typeCheck: true,
    sharedTsConfig: {
      include: ['../knot.config.ts'],
    },
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
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
    sharedPrerenderData: true,
  },
  app: {
    head: {
      title: websiteConfig.title, // default fallback title
      meta: [{ name: 'description', content: websiteConfig.description }],
    },
  },
})
