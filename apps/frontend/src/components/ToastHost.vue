<template>
  <div class="fixed z-50 inset-0 pointer-events-none">
    <div class="absolute right-4 top-4 flex flex-col gap-2 w-full max-w-sm">
      <transition-group name="toast" tag="div">
        <div v-for="t in toasts" :key="t.id"
          class="pointer-events-auto rounded-2xl shadow-lg px-4 py-3 border text-sm flex items-start gap-3"
          :class="typeClass(t.type)" role="status" aria-live="polite">
          <div class="flex-1">{{ t.message }}</div>
          <button class="opacity-70 hover:opacity-100" @click="close(t.id)" aria-label="Fechar">×</button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toastStore, type ToastType } from '../plugins/toast';

const toasts = computed(() => toastStore.list);

function close(id: number) {
  toastStore.remove(id);
}

function typeClass(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-800';
  }
}
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all .15s ease;
}
</style>
