<template>
  <BaseModal v-model="open">
    <div class="p-5 md:p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="text-sm text-slate-500">
          <span>Agenda</span>
          <span class="mx-1">/</span>
          <span class="font-semibold text-slate-700">{{ event?.contextTitle ?? 'Tarefa' }}</span>
        </div>
        <div class="flex items-center gap-2 text-slate-500">
          <button title="Fechar" class="p-2 rounded-lg hover:bg-slate-100" @click="open = false">✕</button>
        </div>
      </div>

      <h2 class="mt-3 text-2xl font-bold text-slate-900">{{ event?.title }}</h2>

      <div class="mt-5 flex justify-start text-sm">
        <div class="flex flex-col items-center gap-6">
          <div class="flex items-center gap-2 min-w-32">
            <span class="text-slate-400">🏷️ Etiqueta</span>
            <span class="font-medium text-slate-700">{{ event?.label ?? 'Apresentação' }}</span>
          </div>

          <div class="flex items-center gap-2 min-w-32">
            <span class="text-slate-400">👥 Responsável</span>
            <div class="flex items-center gap-2">
              <template v-for="(r, i) in (event?.responsaveis ?? [])" :key="i">
                <img v-if="r.avatar" :src="r.avatar" class="w-6 h-6 rounded-full ring-2 ring-white -ml-1 first:ml-0" />
                <span v-else class="text-slate-700">{{ r.name }}</span>
              </template>
              <span v-if="!event?.responsaveis?.length" class="text-slate-700">—</span>
            </div>
          </div>

          <div class="flex items-center gap-2 min-w-28">
            <span class="text-slate-400">🗓️ Status</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              {{ event?.status ?? 'A seguir' }}
            </span>
          </div>

          <div class="flex items-center gap-2 min-w-28">
            <span class="text-slate-400">🚩 Prioridade</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold border" :class="priorityClass">
              {{ (event?.priority ?? 'Alta') }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 border-b border-slate-200 flex items-center gap-6 text-sm">
        <button class="pb-3"
          :class="tab === 'desc' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'text-slate-500'"
          @click="tab = 'desc'">Descrição</button>
        <button class="pb-3"
          :class="tab === 'comments' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'text-slate-500'"
          @click="tab = 'comments'">Comentários <span v-if="comments.length">({{ comments.length }})</span></button>
      </div>

      <div v-if="tab === 'desc'" class="pt-4 text-sm text-slate-700 leading-relaxed">
        <p>{{ event?.resume ?? 'Sem descrição.' }}</p>
        <p class="mt-2 text-xs text-slate-500">{{ event?.start }}–{{ event?.end }}</p>
      </div>

      <div v-else class="pt-4 space-y-4">
        <div class="rounded-xl border border-slate-200 p-3">
          <textarea v-model="draft" rows="2" class="w-full outline-none resize-none"
            placeholder="Escreva um comentário..."></textarea>
          <div class="mt-2 flex items-center justify-between">
            <div class="text-slate-400 text-xs">Use @ para mencionar</div>
            <button class="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              @click="publish">
              Publicar
            </button>
          </div>
        </div>

        <div v-for="c in comments" :key="c.id" class="flex items-start gap-3">
          <div class="w-7 h-7 rounded-full bg-slate-200 grid place-items-center">👤</div>
          <div class="flex-1">
            <div class="text-sm">
              <span class="font-semibold text-slate-800">{{ c.author }}</span>
              <span class="text-slate-400 text-xs ml-2">{{ c.createdAt }}</span>
            </div>
            <p class="text-sm text-slate-700">{{ c.text }}</p>
          </div>
          <button class="text-slate-400 hover:text-slate-600 p-1">⋯</button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import BaseModal from './BaseModal.vue'

type Resp = { name: string; avatar?: string }
type Comment = { id: string; author: string; text: string; createdAt: string }

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
  responsaveis?: Resp[]
  comments?: Comment[]
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

const tab = ref<'desc' | 'comments'>('comments')
const draft = ref('')

const comments = ref<Comment[]>(props.event?.comments ?? [])
watch(() => props.event, (ev) => {
  comments.value = ev?.comments ?? []
  tab.value = 'comments'
  draft.value = ''
})

const priorityClass = computed(() => {
  const p = (props.event?.priority ?? 'Alta').toString().toLowerCase()
  if (p.includes('baixa')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (p.includes('média') || p.includes('media')) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
})

function publish() {
  const text = draft.value.trim()
  if (!text) return
  comments.value.unshift({
    id: Math.random().toString(36).slice(2),
    author: 'Você',
    text,
    createdAt: 'agora'
  })
  draft.value = ''
}
</script>
