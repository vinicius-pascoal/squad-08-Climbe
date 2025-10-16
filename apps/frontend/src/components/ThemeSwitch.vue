<script setup lang="ts">
import { ref, onMounted } from 'vue'

const storageKey = 'climb_theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
  const root = document.documentElement
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}

function toggle() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  localStorage.setItem(storageKey, isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    isDark.value = saved === 'dark'
    applyTheme(isDark.value)
  } else {
    isDark.value = false
    applyTheme(isDark.value)
  }
})
</script>

<template>
  <button @click="toggle" :aria-pressed="isDark"
    class="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-gray-300 dark:border-gray-600">
    <span class="w-9 h-5 relative inline-block">
      <span
        :class="['absolute inset-0 rounded-full transition-colors duration-200', isDark ? 'bg-[#2C3652]' : 'bg-gray-300']"></span>
      <span
        :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200', isDark ? 'translate-x-4' : 'translate-x-0']"></span>
    </span>
    <span class="text-sm text-muted">{{ isDark ? 'Escuro' : 'Claro' }}</span>
  </button>
</template>

<style scoped>
.bg-card {
  background-color: var(--card);
}

.text-muted {
  color: var(--muted);
}
</style>
