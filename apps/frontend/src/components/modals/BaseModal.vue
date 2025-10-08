<template>
  <teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[100]">
      <div class="absolute inset-0 bg-black/40" @click="close"></div>
      <div class="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden" role="dialog" aria-modal="true">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function close() {
  emit('update:modelValue', false)
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onEsc))
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))
</script>
