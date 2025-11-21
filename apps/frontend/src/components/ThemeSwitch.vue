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
    <!-- Ícone do Sol (lado esquerdo - modo claro) -->
    <svg class="w-5 h-5 transition-colors duration-200" :class="!isDark ? 'text-yellow-500' : 'text-gray-400'"
      fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>

    <span class="w-9 h-5 relative inline-block">
      <span :class="['absolute inset-0 rounded-full transition-colors duration-200']"
        :style="isDark ? { backgroundColor: 'var(--accent)' } : { backgroundColor: 'var(--border)' }"></span>
      <span
        :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200', isDark ? 'translate-x-4 ring-2 ring-cyan-400/60' : 'translate-x-0']"
        :style="isDark ? { boxShadow: '0 0 0 4px rgba(37,210,212,0.08)' } : {}"></span>
    </span>

    <!-- Ícone da Lua (lado direito - modo escuro) -->
    <svg class="w-5 h-5 transition-colors duration-200" :class="isDark ? 'text-cyan-400' : 'text-gray-400'"
      fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
        clip-rule="evenodd" />
    </svg>
  </button>
</template>

<style scoped>
.bg-card {
  background-color: var(--card);
}
</style>
