<script setup lang="ts">
const postDataRet = await usePostData()
const websiteDataRet = await useWebsiteData()
const postData = assertNonNull(postDataRet.data.value)
const websiteData = assertNonNull(websiteDataRet.data.value)

const postMeta = postData.meta

const date = new Date(postMeta.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
</script>

<template>
  <Head>
    <Title>{{ postMeta.title }} | {{ websiteData.config.title }}</Title>
  </Head>
  <article class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <header class="mb-8 pb-4 border-b border-[var(--color-border-muted)]">
      <h1 class="text-3xl font-semibold mb-2 text-[var(--color-fg-default)] tracking-tight">
        {{ postMeta.title }}
      </h1>
      <div class="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
        <span
          class="px-2 py-0.5 rounded-full border border-[var(--color-border-default)] text-xs font-medium"
        >
          Post
        </span>
        <span class="text-[var(--color-fg-muted)]">on {{ date }}</span>
      </div>
    </header>

    <AutoNotionPage :record-map="postData.recordMap" />
  </article>
</template>
