<script setup lang="ts">
import { Head, Title } from '#components'
import { useContentPageData } from '~/composables/useContentPageData'
import { useWebsiteConfig } from '~/composables/useWebsiteConfig'
import { assertNonNull } from '~/utils'
import AutoNotionPage from '~/components/AutoNotionPage.vue'

const pageDataRet = await useContentPageData()
const websiteConfigRet = await useWebsiteConfig()
const pageData = assertNonNull(pageDataRet.data.value)
const websiteConfig = assertNonNull(websiteConfigRet.data.value)

const pageMeta = pageData.meta
</script>

<template>
  <Head>
    <Title>{{ pageMeta.title }} | {{ websiteConfig.title }}</Title>
  </Head>
  <article class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <header class="mb-8 pb-4 border-b border-[var(--color-border-muted)]">
      <h1 class="text-3xl font-semibold mb-2 text-[var(--color-fg-default)] tracking-tight">
        {{ pageMeta.title }}
      </h1>
    </header>

    <AutoNotionPage :record-map="pageData.recordMap" :page-id="pageData.meta.pageId" />
  </article>
</template>
