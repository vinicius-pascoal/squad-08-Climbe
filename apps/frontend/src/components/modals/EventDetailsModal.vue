<template>
  <BaseModal v-model="open">
    <div class="p-5 md:p-6 bg-white dark:bg-brand-0a0a0a">
      <div class="flex items-start justify-between gap-4">
        <div class="text-sm text-brand-5f6060 dark:text-brand-e5e7eb">
          <span>Agenda</span>
          <span class="mx-1">/</span>
          <span class="font-semibold text-brand-000 dark:text-white">{{ event?.contextTitle ?? 'Tarefa' }}</span>
        </div>
        <div class="flex items-center gap-2 text-brand-5f6060 dark:text-brand-e5e7eb">
          <button title="Fechar" class="p-2 rounded-lg hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 transition"
            @click="open = false">✕</button>
        </div>
      </div>

      <h2 class="mt-3 text-2xl font-bold text-brand-000 dark:text-white">{{ event?.title }}</h2>

      <div class="mt-5 flex justify-start text-sm">
        <div class="flex flex-col items-start gap-4 w-full">
          <div class="flex items-center gap-2 min-w-32">
            <span class="text-brand-5f6060 dark:text-brand-e5e7eb">🏷️ Etiqueta</span>
            <span class="font-medium text-brand-000 dark:text-white">{{ event?.label ?? 'Apresentação' }}</span>
          </div>

          <div class="flex items-center gap-2 min-w-28">
            <span class="text-brand-5f6060 dark:text-brand-e5e7eb">🗓️ Status</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
              {{ event?.status ?? 'A seguir' }}
            </span>
          </div>

          <div class="flex items-center gap-2 min-w-28">
            <span class="text-brand-5f6060 dark:text-brand-e5e7eb">🚩 Prioridade</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold border" :class="priorityClass">
              {{ (event?.priority ?? 'Alta') }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 text-sm text-brand-000 dark:text-white leading-relaxed">
        <h3 class="font-semibold text-brand-5f6060 dark:text-brand-e5e7eb mb-2">Descrição</h3>
        <p>{{ event?.resume ?? 'Sem descrição.' }}</p>
        <p class="mt-3 text-xs text-brand-5f6060 dark:text-brand-e5e7eb">
          <span class="font-medium">Horário:</span> {{ event?.start }}–{{ event?.end }}
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseModal from './BaseModal.vue'

type CalendarEvent = {
  id: string
  dayIndex: number
  start: string
  end: string
  title: string
  color?: string
  resume?: string
}

type EventDetails = CalendarEvent & {
  contextTitle?: string
  label?: string
  status?: string
  priority?: 'Baixa' | 'Média' | 'Alta' | 'Media'
}

const props = defineProps<{
  modelValue: boolean
  event?: EventDetails | null
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const priorityClass = computed(() => {
  const p = (props.event?.priority ?? 'Alta').toString().toLowerCase()
  if (p.includes('baixa')) return 'bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700'
  if (p.includes('média') || p.includes('media')) return 'bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-700'
  return 'bg-rose-50 dark:bg-rose-900 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-700'
})
</script>
