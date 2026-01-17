<script setup lang="ts">
import { Head, Title } from '#components'
import { useContentPageData } from '~/composables/useContentPageData'
import AutoNotionPage from '~/components/AutoNotionPage.vue'

const contentPageData = await useContentPageData()

const pageMeta = contentPageData.page.meta
</script>

<template>
  <Head>
    <Title>{{ pageMeta.title }} | {{ contentPageData.websiteTitle }}</Title>
  </Head>
  <article class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <header class="mb-8 pb-4 border-b border-[var(--color-border-muted)]">
      <h1 class="text-3xl font-semibold mb-2 text-[var(--color-fg-default)] tracking-tight">
        {{ pageMeta.title }}
      </h1>
    </header>

    <AutoNotionPage
      :record-map="contentPageData.page.recordMap"
      :page-id="contentPageData.page.meta.pageId"
    />
  </article>
</template>
