<template>
  <label class="block">
    <span class="mb-1 block text-xs font-medium text-slate-600">
      {{ label }} <span v-if="required" class="text-red-600">*</span>
    </span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{ label: string; required?: boolean }>()
</script>