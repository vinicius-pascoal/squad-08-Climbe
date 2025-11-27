<template>
  <teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[100]" @click.self="close">
      <div class="absolute inset-0 bg-black/40 dark:bg-black/60 pointer-events-none"></div>
      <div class="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6 pointer-events-none">
        <div
          class="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-transparent pointer-events-auto dark:base-modal"
          role="dialog" aria-modal="true">
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

<style scoped>
.dark .base-modal {
  background: linear-gradient(244.47deg, #2F3C60 3.97%, #222A3F 24.52%, #1F263A 50.41%, #1F2638 70.95%) !important;
  border: 1px solid #485780 !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;
}
</style>
