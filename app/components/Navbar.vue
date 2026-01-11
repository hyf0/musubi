<script setup lang="ts">
import MdiGithub from '~icons/mdi/github'
import MdiTwitter from '~icons/mdi/twitter'

const websiteDataRet = await useWebsiteData()
const websiteData = assertNonNull(websiteDataRet.data.value)
const websiteConfigRet = await useWebsiteConfig()
const websiteConfig = assertNonNull(websiteConfigRet.data.value)
</script>

<template>
  <header class="border-b border-[var(--color-border-muted)] bg-[var(--color-header-bg)] py-4">
    <div
      class="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 flex items-center justify-center relative"
    >
      <nav class="hidden md:flex items-center gap-6">
        <a
          href="/"
          class="text-sm font-semibold text-[var(--color-fg-default)] hover:text-[var(--color-fg-muted)] transition-colors"
        >
          Home
        </a>
        <a
          v-for="page in websiteData.contentPages"
          :key="page.slug"
          :href="`/${page.slug}`"
          class="text-sm font-semibold text-[var(--color-fg-default)] hover:text-[var(--color-fg-muted)] transition-colors"
        >
          {{ page.title }}
        </a>
        <template v-if="websiteConfig.social?.github">
          <a
            :href="websiteConfig.social.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-accent-fg)] transition-colors"
            title="GitHub"
          >
            <MdiGithub class="w-5 h-5" />
          </a>
        </template>
        <template v-if="websiteConfig.social?.x">
          <a
            :href="websiteConfig.social.x"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-accent-fg)] transition-colors"
            title="Twitter/X"
          >
            <MdiTwitter class="w-5 h-5" />
          </a>
        </template>
      </nav>
      <ClientOnly>
        <ColorModeToggle class="absolute right-4 sm:right-6 xl:right-8" />
      </ClientOnly>
    </div>
  </header>
</template>
