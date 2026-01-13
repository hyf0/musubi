<script setup lang="ts">
import { Head, Title } from '#components'
import { useWebsiteData } from '~/composables/useWebsiteData'
import { useWebsiteConfig } from '~/composables/useWebsiteConfig'
import { assertNonNull } from '~/utils'

const websiteDataRet = await useWebsiteData()
const websiteConfigRet = await useWebsiteConfig()
const websiteData = assertNonNull(websiteDataRet.data.value)
const websiteConfig = assertNonNull(websiteConfigRet.data.value)

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <Head>
    <Title>{{ websiteConfig.title }}</Title>
  </Head>
  <div class="max-w-4xl mx-auto py-8">
    <div
      class="border border-[var(--color-border-default)] rounded-md overflow-hidden bg-[var(--color-canvas-default)]"
    >
      <div
        class="bg-[var(--color-canvas-subtle)] px-4 py-3 border-b border-[var(--color-border-default)] flex justify-between items-center"
      >
        <h2 class="text-sm font-semibold text-[var(--color-fg-default)]">Posts</h2>
        <span class="text-xs text-[var(--color-fg-muted)] font-mono"
          >{{ websiteData.postMetaList.length }} posts</span
        >
      </div>

      <div
        v-if="websiteData.postMetaList.length > 0"
        class="divide-y divide-[var(--color-border-muted)]"
      >
        <article
          v-for="postMeta in websiteData.postMetaList"
          :key="postMeta.slug"
          class="group hover:bg-[var(--color-canvas-subtle)] transition-colors duration-150"
        >
          <a :href="`/blog/${postMeta.slug}`" class="block px-4 py-3 sm:px-6 no-underline">
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <h3
                class="text-base font-semibold text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)] m-0"
              >
                {{ postMeta.title }}
              </h3>
              <time class="text-xs text-[var(--color-fg-muted)] font-mono whitespace-nowrap">
                {{ formatDate(postMeta.date) }}
              </time>
            </div>
            <p
              v-if="postMeta.description"
              class="mt-1 text-sm text-[var(--color-fg-muted)] line-clamp-2"
            >
              {{ postMeta.description }}
            </p>
          </a>
        </article>
      </div>
      <div v-else class="p-8 text-center text-[var(--color-fg-muted)]">No posts found.</div>
    </div>
  </div>
</template>
