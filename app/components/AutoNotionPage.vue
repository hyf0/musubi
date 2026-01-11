<script setup lang="ts">
import type { ExtendedRecordMap } from 'notion-types';

const props  = defineProps<{
  recordMap: ExtendedRecordMap
}>()

const colorMode = useColorMode()

const isDark = computed(() => {
  return colorMode.value === 'dark'
})
</script>

<template>
  <NotionPage :dark-mode="isDark" :record-map="props.recordMap" />
</template>
