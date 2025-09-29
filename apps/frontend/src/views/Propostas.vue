<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex w-full md:max-w-xl items-center gap-3">
        <div class="relative flex-1">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
            </svg>
          </span>
          <input v-model="ui.search" type="text" placeholder="pesquisar"
            class="w-full rounded-xl border border-slate-300 bg-white/70 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#CAD8FD] border border-[#3B67D0] text-white rounded-lg px-4 py-2 hover cursor-pointer ml-16"
          @click="onCriarProposta">
          Criar Proposta
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <div class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2">
        <span class="text-slate-600 text-sm">Status</span>
        <span class="text-slate-400">▾</span>
        <select v-model="filters.status" class="pill-select">
          <option value="">Todos</option>
          <option value="APROVADA">Aprovada</option>
          <option value="REVISAO">Em Revisão</option>
          <option value="REPROVADA">Reprovada</option>
        </select>
      </div>

      <div class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2">
        <span class="text-slate-600 text-sm">Data</span>
        <span class="text-slate-400">▾</span>
        <div class="flex items-center gap-2">
          <input v-model="filters.startDate" type="date" class="pill-input">
          <span class="text-slate-400">—</span>
          <input v-model="filters.endDate" type="date" class="pill-input">
        </div>
      </div>

      <div class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2">
        <span class="text-slate-600 text-sm">Responsável</span>
        <span class="text-slate-400">▾</span>
        <select v-model="filters.responsavel" class="pill-select">
          <option value="">Todos</option>
          <option v-for="r in responsaveis" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="p-4 border-b border-slate-200">
        <h2 class="font-semibold text-slate-800">Propostas</h2>
      </div>

      <div v-if="loading.propostas" class="p-6">
        <div class="space-y-2">
          <div v-for="i in 5" :key="i" class="grid grid-cols-6 gap-2">
            <div v-for="j in 6" :key="j" class="h-10 rounded bg-slate-100 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full border-collapse">
          <thead class="bg-slate-50 text-sm text-slate-600">
            <tr>
              <th class="text-left px-4 py-3">
                <button class="inline-flex items-center gap-1 hover:underline" @click="sortBy('id')">
                  <span>ID da proposta</span>
                  <span class="text-slate-400">{{ sortIcon('id') }}</span>
                </button>
              </th>
              <th class="text-left px-4 py-3">
                <button class="inline-flex items-center gap-1 hover:underline" @click="sortBy('empresa')">
                  <span>Empresa</span>
                  <span class="text-slate-400">{{ sortIcon('empresa') }}</span>
                </button>
              </th>
              <th class="text-left px-4 py-3">
                <button class="inline-flex items-center gap-1 hover:underline" @click="sortBy('data')">
                  <span>Data</span>
                  <span class="text-slate-400">{{ sortIcon('data') }}</span>
                </button>
              </th>
              <th class="text-left px-4 py-3">Status</th>
              <th class="text-left px-4 py-3">
                <button class="inline-flex items-center gap-1 hover:underline" @click="sortBy('responsavel')">
                  <span>Responsável</span>
                  <span class="text-slate-400">{{ sortIcon('responsavel') }}</span>
                </button>
              </th>
              <th class="text-left px-4 py-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pageItems" :key="p.id" class="border-t border-slate-100 hover:bg-slate-50/60">
              <td class="px-4 py-3 font-medium text-slate-700">{{ p.id }}</td>
              <td class="px-4 py-3">{{ p.empresa }}</td>
              <td class="px-4 py-3">{{ formatDate(p.data) }}</td>
              <td class="px-4 py-3">
                <span :class="badgeClass(p.status)"
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
                  {{ badgeText(p.status) }}
                </span>
              </td>
              <td class="px-4 py-3">{{ p.responsavel }}</td>
              <td class="px-4 py-3">
                <button class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                  @click="abrirProposta(p)">
                  Abrir
                </button>
              </td>
            </tr>
            <tr v-if="!pageItems.length">
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">Nenhum resultado.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-slate-200">
        <div class="flex items-center justify-between gap-3">
          <div class="text-sm text-slate-600">Total: <b>{{ filtered.length }}</b></div>
          <div class="flex items-center gap-2">
            <button class="pg-btn" @click="goFirst()">«</button>
            <button class="pg-btn" @click="goPrev()">‹</button>
            <span class="text-sm text-slate-700">Página <b>{{ ui.page }}</b> de <b>{{ totalPages }}</b></span>
            <button class="pg-btn" @click="goNext()">›</button>
            <button class="pg-btn" @click="goLast()">»</button>
            <select class="ml-2 rounded-md border border-slate-300 px-2 py-1 text-sm" :value="ui.pageSize"
              @change="setPageSize($event)">
              <option v-for="s in [5, 10, 20, 50]" :key="s" :value="s">{{ s }}/página</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 class="font-semibold text-slate-800">Histórico de Revisões</h3>
          <input v-model="histSearch" type="text" placeholder="Filtrar"
            class="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
        </div>

        <div v-if="loading.historico" class="p-6">
          <div class="space-y-2">
            <div v-for="i in 4" :key="i" class="grid grid-cols-6 gap-2">
              <div v-for="j in 6" :key="j" class="h-10 rounded bg-slate-100 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full border-collapse">
            <thead class="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th class="text-left px-4 py-3">Data</th>
                <th class="text-left px-4 py-3">Usuário</th>
                <th class="text-left px-4 py-3">Ação</th>
                <th class="text-left px-4 py-3">Status</th>
                <th class="text-left px-4 py-3">Versão</th>
                <th class="text-left px-4 py-3">Comentário</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in historicoPaginado" :key="h.id" class="border-t border-slate-100 hover:bg-slate-50/60">
                <td class="px-4 py-3">{{ formatDate(h.data) }}</td>
                <td class="px-4 py-3">{{ h.usuario }}</td>
                <td class="px-4 py-3">{{ h.acao }}</td>
                <td class="px-4 py-3">
                  <span :class="badgeClass(h.status)"
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
                    {{ badgeText(h.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ h.versao }}</td>
                <td class="px-4 py-3 text-slate-600">{{ h.comentario }}</td>
              </tr>
              <tr v-if="!historicoFiltrado.length">
                <td colspan="6" class="px-4 py-6 text-center text-slate-500">Nenhum registro.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t border-slate-200">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm text-slate-600">Total: <b>{{ historicoFiltrado.length }}</b></div>
            <div class="flex items-center gap-2">
              <button class="pg-btn" @click="goFirstHist()">«</button>
              <button class="pg-btn" @click="goPrevHist()">‹</button>
              <span class="text-sm text-slate-700">Página <b>{{ uiHist.page }}</b> de <b>{{ totalPagesHist }}</b></span>
              <button class="pg-btn" @click="goNextHist()">›</button>
              <button class="pg-btn" @click="goLastHist()">»</button>
              <select class="ml-2 rounded-md border border-slate-300 px-2 py-1 text-sm" :value="uiHist.pageSize"
                @change="setPageSizeHist($event)">
                <option v-for="s in [6, 10, 20, 50]" :key="s" :value="s">{{ s }}/página</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <h3 class="font-semibold text-slate-800 mb-4">Distribuição de Status</h3>
        <div class="flex items-center gap-4">
          <svg :width="pieSize" :height="pieSize" :viewBox="`0 0 ${pieSize} ${pieSize}`" class="shrink-0">
            <g :transform="`rotate(-90 ${pieHalf} ${pieHalf})`">
              <circle v-for="(seg, idx) in pieSegments" :key="idx" :cx="pieHalf" :cy="pieHalf" :r="pieRadius"
                :stroke="seg.color" :stroke-width="pieRadius" fill="none" :stroke-dasharray="seg.dasharray"
                :stroke-dashoffset="seg.dashoffset" />
            </g>
            <circle :cx="pieHalf" :cy="pieHalf" :r="pieRadius - 4" fill="transparent" stroke="#fff" stroke-width="2" />
          </svg>

          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span>{{ percent('APROVADA') }}% Aprovada</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-amber-400"></span>
              <span>{{ percent('REVISAO') }}% Em Revisão</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-rose-500"></span>
              <span>{{ percent('REPROVADA') }}% Reprovadas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

type Status = 'APROVADA' | 'REVISAO' | 'REPROVADA'
type Proposta = { id: string; empresa: string; data: string | Date; status: Status; responsavel: string }
type Historico = { id: string; data: string | Date; usuario: string; acao: string; status: Status; versao: string; comentario: string }

const ui = reactive({ page: 1, pageSize: 5, search: '' })
const uiHist = reactive({ page: 1, pageSize: 6 })

const filters = reactive<{ status: '' | Status; responsavel: string; startDate: string; endDate: string }>({
  status: '', responsavel: '', startDate: '', endDate: ''
})

const responsaveis = ref<string[]>([])
const propostas = ref<Proposta[]>([])
const historico = ref<Historico[]>([])
const loading = reactive({ propostas: true, historico: true })
const histSearch = ref('')


async function fetchPropostas() {
  loading.propostas = true
  try {
    // Mock 
    propostas.value = [
      { id: 'PROP-2025-001', empresa: 'RIHappy', data: '2025-08-21', status: 'APROVADA', responsavel: 'Luiz Gomes' },
      { id: 'PROP-2025-002', empresa: 'TED talk', data: '2025-08-18', status: 'REVISAO', responsavel: 'Vanessa' },
      { id: 'PROP-2025-003', empresa: 'XOPs', data: '2025-08-28', status: 'APROVADA', responsavel: 'Luiz Gomes' },
      { id: 'PROP-2025-004', empresa: 'ABNT', data: '2025-09-05', status: 'REPROVADA', responsavel: 'Neymar' },
    ]
  } finally {
    loading.propostas = false
    responsaveis.value = Array.from(new Set(propostas.value.map(p => p.responsavel))).sort()
  }
}

async function fetchHistorico() {
  loading.historico = true
  try {
    //mock
    historico.value = [
      { id: 'h1', data: '2025-08-21', usuario: 'Neymar', acao: 'Upload', status: 'REVISAO', versao: 'V2', comentario: 'Primeira versão anexada.' }
    ]
  } finally {
    loading.historico = false
  }
}

const sortKey = ref<keyof Proposta | ''>('')
const sortDir = ref<'asc' | 'desc'>('asc')

function sortBy(col: keyof Proposta) {
  if (sortKey.value === col) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = col; sortDir.value = 'asc' }
}
function sortIcon(col: keyof Proposta) {
  if (sortKey.value !== col) return '↕'
  return sortDir.value === 'asc' ? '▲' : '▼'
}

const filtered = computed(() => {
  const q = ui.search.trim().toLowerCase()
  const sd = filters.startDate ? new Date(filters.startDate) : null
  const ed = filters.endDate ? new Date(filters.endDate) : null

  const list = propostas.value.filter(p => {
    if (filters.status && p.status !== filters.status) return false
    if (filters.responsavel && p.responsavel !== filters.responsavel) return false
    if (sd || ed) {
      const d = new Date(p.data)
      if (sd && d < sd) return false
      if (ed && d > ed) return false
    }
    if (!q) return true
    return p.id.toLowerCase().includes(q) || p.empresa.toLowerCase().includes(q) || p.responsavel.toLowerCase().includes(q)
  })

  if (!sortKey.value) return list
  const k = sortKey.value
  return [...list].sort((a, b) => {
    const av = k === 'data' ? new Date(a[k] as any).getTime() : String(a[k]).toLowerCase()
    const bv = k === 'data' ? new Date(b[k] as any).getTime() : String(b[k]).toLowerCase()
    return (av > bv ? 1 : av < bv ? -1 : 0) * (sortDir.value === 'asc' ? 1 : -1)
  })
})

const pageItems = computed(() => filtered.value.slice((ui.page - 1) * ui.pageSize, (ui.page - 1) * ui.pageSize + ui.pageSize))
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / ui.pageSize)))

watch([() => ui.search, () => filters.status, () => filters.responsavel, () => filters.startDate, () => filters.endDate], () => {
  ui.page = 1
})

const historicoFiltrado = computed(() => {
  const q = histSearch.value.trim().toLowerCase()
  if (!q) return historico.value
  return historico.value.filter(h =>
    [h.usuario, h.acao, h.versao, h.comentario].some(v => String(v).toLowerCase().includes(q))
  )
})
const historicoPaginado = computed(() =>
  historicoFiltrado.value.slice((uiHist.page - 1) * uiHist.pageSize, (uiHist.page - 1) * uiHist.pageSize + uiHist.pageSize)
)
const totalPagesHist = computed(() => Math.max(1, Math.ceil(historicoFiltrado.value.length / uiHist.pageSize)))

const pieSize = 140
const pieHalf = pieSize / 2
const pieRadius = pieHalf - 2
const circumference = 2 * Math.PI * pieRadius

const pieSeries = computed(() => {
  const total = Math.max(filtered.value.length, 1)
  const count = (s: Status) => filtered.value.filter(p => p.status === s).length
  return [
    { label: 'Aprovada', value: count('APROVADA') / total, color: '#10b981' },
    { label: 'Em Revisão', value: count('REVISAO') / total, color: '#f59e0b' },
    { label: 'Reprovada', value: count('REPROVADA') / total, color: '#ef4444' },
  ]
})

const pieSegments = computed(() => {
  let offset = 0
  return pieSeries.value.map(s => {
    const len = s.value * circumference
    const seg = {
      color: s.color,
      dasharray: `${len} ${circumference - len}`,
      dashoffset: -offset
    }
    offset += len
    return seg
  })
})

function percent(s: Status) {
  const total = filtered.value.length || 1
  const qtd = filtered.value.filter(p => p.status === s).length
  return Math.round((qtd / total) * 100)
}

function onCriarProposta() { console.log('Criar Proposta') }
function abrirProposta(p: Proposta) { console.log('Abrir', p.id) }

function formatDate(d: string | Date) {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  return date.toLocaleDateString('pt-BR')
}

function badgeText(s: Status) {
  return s === 'APROVADA' ? 'Aprovada' : s === 'REVISAO' ? 'Em Revisão' : 'Reprovada'
}
function badgeClass(s: Status) {
  if (s === 'APROVADA') return 'bg-emerald-100 text-emerald-700 ring-emerald-200'
  if (s === 'REVISAO') return 'bg-amber-100 text-amber-700 ring-amber-200'
  return 'bg-rose-100 text-rose-700 ring-rose-200'
}

function goFirst() { ui.page = 1 }
function goPrev() { ui.page = Math.max(1, ui.page - 1) }
function goNext() { ui.page = Math.min(totalPages.value, ui.page + 1) }
function goLast() { ui.page = totalPages.value }
function setPageSize(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  ui.pageSize = v
  ui.page = 1
}

function goFirstHist() { uiHist.page = 1 }
function goPrevHist() { uiHist.page = Math.max(1, uiHist.page - 1) }
function goNextHist() { uiHist.page = Math.min(totalPagesHist.value, uiHist.page + 1) }
function goLastHist() { uiHist.page = totalPagesHist.value }
function setPageSizeHist(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  uiHist.pageSize = v
  uiHist.page = 1
}

onMounted(async () => {
  await Promise.all([fetchPropostas(), fetchHistorico()])
})
</script>

<style scoped>
.pill-input,
.pill-select {
  @apply rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-sky-400;
}

.pg-btn {
  @apply rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100;
}

.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 5px center;
  padding-left: 40px;
}
</style>
