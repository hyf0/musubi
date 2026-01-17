<script setup lang="ts">
import { ClientOnly } from '#components'
import { useNavbarData } from '~/composables/useNavbarData'
import ColorModeToggle from '~/components/ColorModeToggle.vue'
import MdiGithub from '~icons/mdi/github'
import MdiTwitter from '~icons/mdi/twitter'

const navbarData = await useNavbarData()
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
          v-for="page in navbarData.contentPages"
          :key="page.slug"
          :href="`/${page.slug}`"
          class="text-sm font-semibold text-[var(--color-fg-default)] hover:text-[var(--color-fg-muted)] transition-colors"
        >
          {{ page.title }}
        </a>
        <template v-if="navbarData.social?.github">
          <a
            :href="navbarData.social.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-accent-fg)] transition-colors"
            title="GitHub"
          >
            <MdiGithub class="w-5 h-5" />
          </a>
        </template>
        <template v-if="navbarData.social?.x">
          <a
            :href="navbarData.social.x"
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
