<script setup lang="ts">
import { ref, onMounted } from 'vue'

const storageKey = 'climb_theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
  const root = document.documentElement
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}
// add a small helper to also toggle on <body> as a fallback for some styles
function applyThemeFallback(dark: boolean) {
  try {
    const body = document.body
    if (dark) body.classList.add('dark')
    else body.classList.remove('dark')
  } catch (e) {
    // ignore in non-browser environments
  }
}

function toggle() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  applyThemeFallback(isDark.value)
  // quick debug hint in console to help verify behavior
  // remove or reduce in production if noisy
  // eslint-disable-next-line no-console
  console.debug('[ThemeSwitch] theme set:', isDark.value ? 'dark' : 'light', 'html.classList=', document.documentElement.className)
  localStorage.setItem(storageKey, isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    isDark.value = saved === 'dark'
    applyTheme(isDark.value)
    applyThemeFallback(isDark.value)
  } else {
    isDark.value = false
    applyTheme(isDark.value)
  }
})
</script>

<template>
  <button @click="toggle" :aria-pressed="isDark"
    class="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-gray-300 dark:border-cyan-700">
    <span class="w-9 h-5 relative inline-block">
      <span :class="['absolute inset-0 rounded-full transition-colors duration-200']"
        :style="isDark ? { backgroundColor: 'var(--accent)' } : { backgroundColor: 'var(--border)' }"></span>
      <span
        :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200', isDark ? 'translate-x-4 ring-2 ring-cyan-400/60' : 'translate-x-0']"
        :style="isDark ? { boxShadow: '0 0 0 4px rgba(37,210,212,0.08)' } : {}"></span>
    </span>
    <span class="text-sm text-muted" :class="[isDark ? 'text-cyan-400' : 'text-gray-500']">{{ isDark ? 'Escuro' :
      'Claro' }}</span>
  </button>
</template>

<style scoped>
.bg-card {
  background-color: var(--card);
}
</style>
