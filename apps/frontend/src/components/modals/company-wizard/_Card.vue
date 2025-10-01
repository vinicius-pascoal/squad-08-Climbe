<template>
  <div class="rounded-2xl border border-slate-200 p-4">
    <h4 class="mb-3 text-sm font-semibold text-slate-700">{{ title }}</h4>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>