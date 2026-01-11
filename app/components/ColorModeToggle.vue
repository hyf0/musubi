<script setup lang="ts">
import { useCycleList } from '@vueuse/core'
import { watchEffect, computed } from 'vue'
import MdiWeatherSunny from '~icons/mdi/weather-sunny'
import MdiWeatherNight from '~icons/mdi/weather-night'
import MdiSunMoonStars from '~icons/mdi/sun-moon-stars'

const mode = useColorMode()

const { state, next } = useCycleList(['system', 'light', 'dark'] as const, {
  initialValue: mode.preference
})

watchEffect(() => {
  mode.preference = state.value
})

const stateLabel = computed(() => {
  switch (state.value) {
    case 'light': return 'Light'
    case 'dark': return 'Dark'
    case 'system': return 'Auto'
  }
})
</script>

<template>
  <button
    @click="next()"
    class="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)] transition-colors focus:outline-none"
    :title="`Color mode: ${state}`"
    aria-label="Toggle color mode"
  >
    <template v-if="state === 'light'">
      <MdiWeatherSunny class="w-4 h-4" />
    </template>
    <template v-else-if="state === 'dark'">
      <MdiWeatherNight class="w-4 h-4" />
    </template>
    <template v-else>
      <MdiSunMoonStars class="w-4 h-4" />
    </template>
    <span>{{ stateLabel }}</span>
  </button>
</template>
