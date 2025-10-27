<template>
  <section class="p-4">
    <div class="rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex flex-col">
            <label class="text-xs font-medium text-slate-600">Entidade</label>
            <div class="relative">
              <select v-model="query.entity"
                class="w-44 appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                @change="onFilterChange">
                <option v-for="opt in entityOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div class="flex flex-col">
            <label class="text-xs font-medium text-slate-600">Período</label>
            <div class="flex items-center gap-2">
              <input type="date" v-model="query.startDate"
                class="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                @change="onFilterChange" />
              <span class="text-slate-500">-</span>
              <input type="date" v-model="query.endDate"
                class="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                @change="onFilterChange" />
            </div>
          </div>
        </div>

        <button type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[.99]"
          @click="onExport">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20h14a1 1 0 001-1v-5h-2v4H6v-4H4v5a1 1 0 001 1z"></path>
            <path d="M11 4h2v8h3l-4 4-4-4h3z"></path>
          </svg>
          Exportar Evento
        </button>
      </div>

      <div class="px-4 pb-4">
        <div class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr class="text-left text-slate-600">
                <th class="rounded-l-xl bg-slate-50 px-4 py-2 font-semibold">última atualização</th>
                <th class="bg-slate-50 px-4 py-2 font-semibold">Usuário</th>
                <th class="bg-slate-50 px-4 py-2 font-semibold">Entidade</th>
                <th class="bg-slate-50 px-4 py-2 font-semibold">Ação</th>
                <th class="rounded-r-xl bg-slate-50 px-4 py-2 font-semibold">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in page.size" :key="'skeleton-' + i">
                  <td colspan="5" class="rounded-xl bg-white px-4 py-3 shadow ring-1 ring-slate-200">
                    <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
                  </td>
                </tr>
              </template>
              <tr v-for="log in items" :key="log.id" class="rounded-xl bg-white shadow ring-1 ring-slate-200">
                <td class="rounded-l-xl px-4 py-3 text-slate-700">{{ formatDateTime(log.updatedAt) }}</td>
                <td class="px-4 py-3">{{ log.user }}</td>
                <td class="px-4 py-3">{{ log.entity }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-medium">
                    {{ log.action }}
                  </span>
                </td>
                <td class="rounded-r-xl px-4 py-3 text-slate-600">
                  {{ log.details }}
                </td>
              </tr>
              <tr v-if="!loading && items.length === 0">
                <td colspan="5"
                  class="rounded-xl bg-white px-4 py-10 text-center text-slate-500 shadow ring-1 ring-slate-200">
                  Nenhum registro encontrado para os filtros selecionados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div class="text-xs text-slate-500">
            Página {{ page.index + 1 }} de {{ totalPages }} • {{ page.total }} registros
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-600">Itens por página</label>
            <select v-model.number="page.size"
              class="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none transition focus:border-slate-400"
              @change="onPageSizeChange">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>

            <div class="ml-2 inline-flex overflow-hidden rounded-lg border border-slate-300">
              <button class="px-3 py-1.5 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="page.index === 0 || loading" @click="goTo(page.index - 1)" title="Anterior">
                ‹
              </button>
              <button class="px-3 py-1.5 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="page.index >= totalPages - 1 || loading" @click="goTo(page.index + 1)" title="Próxima">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed, watch, toRaw } from 'vue'

type EntityType = 'contrato' | 'proposta' | 'usuario' | 'login'

interface QueryParams {
  entity: EntityType
  startDate?: string | null
  endDate?: string | null
  page: number
  size: number
}

interface LogItem {
  id: string | number
  updatedAt: string
  user: string
  entity: string
  action: string
  details: string
}

interface PagedResult<T> {
  items: T[]
  total: number
}

const props = defineProps<{
  dataProvider?: (q: QueryParams) => Promise<PagedResult<LogItem>>
}>()

const emit = defineEmits<{
  (e: 'export', payload: QueryParams): void
}>()

const entityOptions = [
  { label: 'Contrato', value: 'contrato' as EntityType },
  { label: 'Proposta', value: 'proposta' as EntityType },
  { label: 'Usuário', value: 'usuario' as EntityType },
  { label: 'Login', value: 'login' as EntityType }
]

const query = reactive({
  entity: 'contrato' as EntityType,
  startDate: '',
  endDate: ''
})

const page = reactive({
  index: 0,
  size: 10,
  total: 0
})

const items = ref<LogItem[]>([])
const loading = ref(false)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(page.total / Math.max(1, page.size)))
)

async function fetchData() {
  loading.value = true

  const params: QueryParams = {
    entity: query.entity,
    startDate: query.startDate || null,
    endDate: query.endDate || null,
    page: page.index,
    size: page.size
  }

  try {
    if (props.dataProvider) {
      const res = await props.dataProvider(params)
      items.value = res.items
      page.total = res.total
    } else {
      await new Promise(r => setTimeout(r, 450))
      const all = mockData()
        .filter(m => m.entityType === params.entity)
        .filter(m => {
          if (params.startDate && new Date(m.updatedAt) < new Date(params.startDate)) return false
          if (params.endDate && new Date(m.updatedAt) > new Date(params.endDate + 'T23:59:59')) return false
          return true
        })

      page.total = all.length
      const start = params.page * params.size
      const end = start + params.size
      items.value = all.slice(start, end).map(({ entityType, ...rest }) => rest)
    }
  } catch (err) {
    console.error('[LogEventos] fetchData error:', err)
    items.value = []
    page.total = 0
  } finally {
    loading.value = false
  }
}

function onFilterChange() {
  page.index = 0
  fetchData()
}

function onPageSizeChange() {
  page.index = 0
  fetchData()
}

function goTo(nextIndex: number) {
  page.index = Math.min(Math.max(0, nextIndex), Math.max(0, totalPages.value - 1))
  fetchData()
}

function onExport() {
  const payload: QueryParams = {
    entity: query.entity,
    startDate: query.startDate || null,
    endDate: query.endDate || null,
    page: page.index,
    size: page.size
  }
  emit('export', payload)
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm}/${yyyy} - ${hh}:${min}`
  } catch {
    return iso
  }
}

function mockData(): Array<LogItem & { entityType: EntityType }> {
  const base: Array<LogItem & { entityType: EntityType }> = [
    { id: 1, updatedAt: '2025-08-30T14:20:00', user: 'João Silva', entity: 'Contrato #123', action: 'Aprovado', details: 'Status alterado para "Ativo"', entityType: 'contrato' },
    { id: 2, updatedAt: '2025-08-30T11:50:00', user: 'Richard Rios', entity: 'Proposta #466', action: 'Criada', details: 'Documento anexado', entityType: 'proposta' },
    { id: 3, updatedAt: '2025-08-30T10:40:00', user: 'Ricardo', entity: 'Contrato #245', action: 'Criado', details: 'Status “Em revisão”', entityType: 'contrato' },
    { id: 4, updatedAt: '2025-08-30T09:20:00', user: 'Vanessa', entity: 'Usuário', action: 'Cadastro', details: 'Usuário “Carlos” cadastrado', entityType: 'usuario' },
    { id: 5, updatedAt: '2025-08-29T17:20:00', user: 'Luiz Gomes', entity: 'Login', action: 'Login', details: 'Sessão iniciada via OAuth', entityType: 'login' },
    { id: 6, updatedAt: '2025-08-29T16:00:00', user: 'Maria Clara', entity: 'Usuário', action: 'Cadastro', details: 'Novo usuário ativo', entityType: 'usuario' },
    { id: 7, updatedAt: '2025-08-29T13:20:00', user: 'Pedro', entity: 'Contrato #98', action: 'Rescindido', details: 'Rescisão registrada', entityType: 'contrato' },
    { id: 8, updatedAt: '2025-08-29T11:30:00', user: 'Marcos', entity: 'Proposta #1912', action: 'Revisada', details: 'Necessário corrigir valores', entityType: 'proposta' },
    { id: 9, updatedAt: '2025-08-29T11:21:00', user: 'João Silva', entity: 'Proposta #578', action: 'Reprovada', details: 'Valores inconsistentes', entityType: 'proposta' }
  ]
  return Array.from({ length: 8 }, (_, i) =>
    base.map(row => ({ ...row, id: `${row.id}-${i}`, updatedAt: row.updatedAt }))
  ).flat()
}

onMounted(fetchData)

watch(() => props.dataProvider, () => fetchData())
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
