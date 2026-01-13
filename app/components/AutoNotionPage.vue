<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '#imports'
import NotionPage from '~/components/NotionPage.vue'
import type { ExtendedRecordMap } from 'notion-types';

const props = defineProps<{
  recordMap: ExtendedRecordMap
  pageId: string
}>()

const colorMode = useColorMode()

const isDark = computed(() => {
  return colorMode.value === 'dark'
})
</script>

<template>
  <NotionPage :dark-mode="isDark" :record-map="props.recordMap" :page-id="props.pageId" />
</template>
