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
            <div class="text-sm font-semibold leading-snug mb-3">{{ t.title }}</div>

            <div v-if="t.responsavel"
              class="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md w-fit"
              :title="t.responsavel">
              <div
                class="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center text-[10px] font-semibold text-emerald-800 dark:text-emerald-100">
                {{ t.responsavel.charAt(0).toUpperCase() }}
              </div>
              <span class="text-[11px] font-medium truncate max-w-[120px]">{{ t.responsavel.split(' ')[0] }}</span>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>{{ t.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-brand-0a0a0a rounded-2xl shadow p-3 border border-brand-e5e7eb dark:border-brand-0e9989">
        <h3 class="font-semibold mb-2 text-brand-000 dark:text-white">Progresso</h3>
        <div v-if="groups.length === 0" class="text-xs text-brand-5f6060 dark:text-brand-e5e7eb py-2">
          Nenhuma tarefa vinculada
        </div>
        <div v-for="g in groups" :key="g.label" class="mb-3">
          <div class="flex justify-between text-xs mb-1 text-brand-000 dark:text-white">
            <span>{{ g.label }}</span>
            <span>{{ g.done }}/{{ g.total }}</span>
          </div>
          <div class="h-1.5 bg-slate-200 dark:bg-brand-5f6060 rounded-full overflow-hidden">
            <div class="h-full transition-all"
              :style="{ width: `${(g.done / g.total) * 100}%`, backgroundColor: g.color }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, getCurrentInstance, watch } from 'vue'
import { updateTarefa } from '../services/tarefa'

const _ins = getCurrentInstance()
const notify = _ins?.appContext.config.globalProperties.$notify as any

type StatusKey = 'todo' | 'doing' | 'review' | 'done'

type Task = {
  id: string
  title: string
  tag: 'Marketing' | 'UI Design' | 'Vendas' | 'Documentação' | 'Desenvolvimento'
  status: StatusKey
  points: number
  date: string
  responsavel?: string
}

const columns: { key: StatusKey; title: string }[] = [
  { key: 'todo', title: 'A Fazer' },
  { key: 'doing', title: 'Em Andamento' },
  { key: 'review', title: 'Em Revisão' },
  { key: 'done', title: 'Concluído' },
]

const props = defineProps<{ tasksData?: Task[] }>()

const state = reactive<{ tasks: Task[] }>({
  tasks: (props.tasksData && props.tasksData.length) ? props.tasksData.slice() : [
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

// Atualizar state quando props mudarem
watch(() => props.tasksData, (newTasks) => {
  if (newTasks && newTasks.length) {
    state.tasks = newTasks.slice()
    console.log('Tarefas atualizadas:', state.tasks)
  }
}, { immediate: true, deep: true })

function filteredBy(status: StatusKey) {
  const q = query.value.trim().toLowerCase()
  return state.tasks.filter((t: Task) => t.status === status && (!q || t.title.toLowerCase().includes(q)))
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

// Mapeia StatusKey para valores que o backend aceita
function mapStatusToBackend(status: StatusKey): string {
  const statusMap: Record<StatusKey, string> = {
    'todo': 'A_FAZER',
    'doing': 'EM_ANDAMENTO',
    'review': 'REVISAO',
    'done': 'CONCLUIDA'
  }
  return statusMap[status]
}

async function onDrop(target: StatusKey) {
  if (!draggingId.value) return
  const task = state.tasks.find((t: Task) => t.id === draggingId.value)
  if (!task) {
    draggingId.value = null
    dropping.value = null
    return
  }

  const oldStatus = task.status
  task.status = target // Atualiza visualmente primeiro
  draggingId.value = null
  dropping.value = null

  try {
    // Salva no backend
    const backendStatus = mapStatusToBackend(target)
    await updateTarefa(Number(task.id), { status: backendStatus })
    console.log(`Tarefa #${task.id} atualizada para status: ${backendStatus}`)
    notify?.success('Status da tarefa atualizado')
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error)
    // Reverte em caso de erro
    task.status = oldStatus
    notify?.error('Erro ao atualizar o status da tarefa')
  }
}

const categoryColors: Record<string, string> = {
  'Marketing': '#f43f5e',       // rose-500
  'UI Design': '#10b981',       // emerald-500
  'Vendas': '#8b5cf6',          // violet-500
  'Documentação': '#3b82f6',    // blue-500
  'Desenvolvimento': '#f59e0b', // amber-500
  'Infraestrutura': '#a855f7',  // purple-500
  'QA': '#eab308',              // yellow-500
  'Design': '#14b8a6',          // teal-500
  'Backend': '#6366f1',         // indigo-500
  'Frontend': '#06b6d4',        // cyan-500
  'default': '#6b7280'          // gray-500 para categorias não mapeadas
}

const groups = computed(() => {
  // Obter apenas as categorias que existem nas tarefas atuais
  const existingTags = [...new Set(state.tasks.map((t: Task) => t.tag))]

  const total = (tag: string) => state.tasks.filter((t: Task) => t.tag === tag).length
  const done = (tag: string) => state.tasks.filter((t: Task) => t.tag === tag && t.status === 'done').length

  const result = existingTags
    .filter(tag => total(tag) > 0) // Apenas categorias com tarefas
    .map(label => ({
      label,
      total: total(label),
      done: done(label),
      color: categoryColors[label] || categoryColors['default']
    }))
    .sort((a, b) => b.total - a.total) // Ordenar por total de tarefas (decrescente)

  console.log('Groups com cores:', result)
  return result
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
