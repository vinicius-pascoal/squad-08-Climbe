<template>
  <div class="w-full taskboard">
    <div class="flex items-center gap-3 mb-4">
      <span class="font-semibold text-lg">Evento</span>
      <div class="flex items-center border rounded-xl shadow px-3 py-2 w-full max-w-md">
        <input v-model="query" type="text" placeholder="Buscar evento" class="flex-1 outline-none text-sm busca" />
        <span class="text-slate-400">•••</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div v-for="col in columns" :key="col.key" class="rounded-2xl shadow p-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">{{ col.title }}</h3>
          <span class="text-slate-400">•••</span>
        </div>

        <div class="min-h-[240px] space-y-3"
          :class="dropping === col.key ? 'ring-2 ring-emerald-400 ring-offset-2 rounded-xl p-1' : ''"
          @dragover.prevent="onDragOver(col.key)" @dragleave="onDragLeave" @drop="onDrop(col.key)">
          <div v-for="t in filteredBy(col.key)" :key="t.id"
            class="bg-white border rounded-2xl shadow-sm p-3 cursor-grab active:cursor-grabbing" draggable="true"
            @dragstart="onDragStart(t.id)">
            <div class="flex items-center justify-between mb-2">
              <span :class="['px-3 py-0.5 rounded-full text-xs font-semibold', tagClass(t.tag)]">{{ t.tag }}</span>
              <span class="text-slate-400">⋮⋮</span>
            </div>
            <div class="text-sm font-semibold leading-snug mb-2">{{ t.title }}</div>
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1">
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 7h8M7 12h10M10 17h4" />
                </svg>
                {{ t.date }}
              </span>
              <span class="inline-flex items-center gap-1">
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 6v12m6-6H6" />
                </svg>
                {{ t.points }}
              </span>
            </div>
          </div>

          <button v-if="col.key !== 'done'" class="mt-2 text-xs text-slate-500 hover:text-emerald-600"
            @click="addCard(col.key)">
            + Adicionar Card
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow p-3">
        <h3 class="font-semibold mb-2">Progresso</h3>
        <div v-for="g in groups" :key="g.label" class="mb-3">
          <div class="flex justify-between text-xs mb-1">
            <span>{{ g.label }}</span>
            <span>{{ g.done }}/{{ g.total }}</span>
          </div>
          <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500" :style="{ width: ((g.done / g.total) * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type StatusKey = 'todo' | 'doing' | 'review' | 'done'

type Task = {
  id: string
  title: string
  tag: 'Marketing' | 'UI Design' | 'Vendas' | 'Documentação' | 'Desenvolvimento'
  status: StatusKey
  points: number
  date: string
}

const columns: { key: StatusKey; title: string }[] = [
  { key: 'todo', title: 'A Fazer' },
  { key: 'doing', title: 'Em Andamento' },
  { key: 'review', title: 'Em Revisão' },
  { key: 'done', title: 'Concluído' },
]

const state = reactive<{ tasks: Task[] }>({
  tasks: [
    { id: 't1', title: 'Revisar e aprovar briefing de e-mail marketing', tag: 'Marketing', status: 'todo', points: 2, date: '23 nov' },
    { id: 't2', title: 'Publicar vídeo institucional', tag: 'Marketing', status: 'todo', points: 1, date: '23 nov' },
    { id: 't3', title: 'Prototipação do projeto com o auxílio do protótipo base', tag: 'UI Design', status: 'doing', points: 3, date: '24 nov' },
    { id: 't4', title: 'Começar a documentação', tag: 'Documentação', status: 'doing', points: 1, date: '24 nov' },
    { id: 't5', title: 'Enviar contrato pra assinatura', tag: 'Vendas', status: 'review', points: 1, date: '24 nov' },
    { id: 't6', title: 'Levantar requisitos do sistema', tag: 'Desenvolvimento', status: 'done', points: 5, date: '24 nov' },
    { id: 't7', title: 'Responder chamado sobre erro de login', tag: 'Desenvolvimento', status: 'done', points: 2, date: '24 nov' },
    { id: 't8', title: 'Ajustar cores e tipografia conforme feedback', tag: 'UI Design', status: 'done', points: 2, date: '24 nov' },
  ]
})

const query = ref('')
const draggingId = ref<string | null>(null)
const dropping = ref<StatusKey | null>(null)

function filteredBy(status: StatusKey) {
  const q = query.value.trim().toLowerCase()
  return state.tasks.filter(t => t.status === status && (!q || t.title.toLowerCase().includes(q)))
}

function onDragStart(id: string) {
  draggingId.value = id
}

function onDragOver(target: StatusKey) {
  dropping.value = target
}

function onDragLeave() {
  dropping.value = null
}

function onDrop(target: StatusKey) {
  if (!draggingId.value) return
  const task = state.tasks.find(t => t.id === draggingId.value)
  if (task) task.status = target
  draggingId.value = null
  dropping.value = null
}

function addCard(status: StatusKey) {
  const id = 't' + Math.random().toString(36).slice(2, 8)
  state.tasks.push({ id, title: 'Novo card', tag: 'Desenvolvimento', status, points: 1, date: '24 nov' })
}

const groups = computed(() => {
  const total = (tag: Task['tag']) => state.tasks.filter(t => t.tag === tag).length
  const done = (tag: Task['tag']) => state.tasks.filter(t => t.tag === tag && t.status === 'done').length
  const tags: Task['tag'][] = ['Desenvolvimento', 'Vendas', 'UI Design', 'Documentação', 'Marketing']
  return tags.map(label => ({ label, total: total(label), done: done(label) }))
})

function tagClass(tag: Task['tag']) {
  const map: Record<Task['tag'], string> = {
    Marketing: 'bg-rose-100 text-rose-700',
    'UI Design': 'bg-emerald-100 text-emerald-700',
    Vendas: 'bg-emerald-200 text-emerald-700',
    Documentação: 'bg-blue-100 text-blue-700',
    Desenvolvimento: 'bg-pink-100 text-pink-700'
  }
  return 'px-2 py-[2px] rounded-full ' + map[tag]
}
</script>
