<script setup lang="ts">
import { useFooterData } from '~/composables/useFooterData'

const footerData = await useFooterData()
</script>

<template>
  <footer
    class="border-t border-[var(--color-border-muted)] mt-16 py-10 bg-[var(--color-canvas-default)]"
  >
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-fg-muted)]"
      >
        <div class="flex items-center gap-4">
          <span>&copy; {{ new Date().getFullYear() }} {{ footerData.author }}</span>
        </div>
        <div class="flex items-center gap-4">
          <p class="flex items-center gap-1">
            Powered by
            <a
              href="https://github.com/hyf0/musubi"
              target="_blank"
              class="font-semibold text-[var(--color-fg-default)] hover:text-[var(--color-accent-fg)] no-underline"
              >Musubi</a
            >
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
