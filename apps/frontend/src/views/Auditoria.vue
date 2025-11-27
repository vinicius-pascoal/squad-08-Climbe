<template>
  <section class="p-4">
    <div class="rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex flex-col">
            <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Entidade</label>
            <div class="relative">
              <select v-model="query.entity"
                class="w-44 appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
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
            <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Período</label>
            <div class="flex items-center gap-2">
              <input type="date" v-model="query.startDate"
                class="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                @change="onFilterChange" />
              <span class="text-slate-500 dark:text-slate-400">-</span>
              <input type="date" v-model="query.endDate"
                class="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                @change="onFilterChange" />
            </div>
          </div>
        </div>

        <button type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          :disabled="exporting || loading" @click="onExport">
          <svg v-if="!exporting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M5 20h14a1 1 0 001-1v-5h-2v4H6v-4H4v5a1 1 0 001 1z"></path>
            <path d="M11 4h2v8h3l-4 4-4-4h3z"></path>
          </svg>
          <svg v-else class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ exporting ? 'Exportando...' : 'Exportar Excel' }}
        </button>
      </div>

      <div class="px-4 pb-4">
        <div class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr class="text-left text-slate-600 dark:text-slate-400">
                <th class="rounded-l-xl bg-slate-50 px-4 py-2 font-semibold dark:bg-slate-700">Data/Hora</th>
                <th class="bg-slate-50 px-4 py-2 font-semibold dark:bg-slate-700">Usuário</th>
                <th class="bg-slate-50 px-4 py-2 font-semibold dark:bg-slate-700">Entidade</th>
                <th class="bg-slate-50 px-4 py-2 font-semibold dark:bg-slate-700">Ação</th>
                <th class="rounded-r-xl bg-slate-50 px-4 py-2 font-semibold dark:bg-slate-700">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in page.size" :key="'skeleton-' + i">
                  <td colspan="5"
                    class="rounded-xl bg-white px-4 py-3 shadow ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-600"></div>
                  </td>
                </tr>
              </template>
              <tr v-for="log in items" :key="log.id"
                class="rounded-xl bg-white shadow ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <td class="rounded-l-xl px-4 py-3 text-slate-700 dark:text-slate-300">{{ formatDateTime(log.dataCriacao)
                }}</td>
                <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ log.usuario?.nome || 'Sistema' }}</td>
                <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ log.entidade }} {{ log.entidadeId ?
                  `#${log.entidadeId}` :
                  '' }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-medium dark:border-slate-600 dark:text-slate-300">
                    {{ log.acao }}
                  </span>
                </td>
                <td class="rounded-r-xl px-4 py-3 text-slate-600 dark:text-slate-400">
                  {{ log.descricao || '-' }}
                </td>
              </tr>
              <tr v-if="!loading && items.length === 0">
                <td colspan="5"
                  class="rounded-xl bg-white px-4 py-10 text-center text-slate-500 shadow ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
                  Nenhum registro encontrado para os filtros selecionados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div class="text-xs text-slate-500 dark:text-slate-400">
            Página {{ page.index }} de {{ totalPages }} • {{ page.total }} registros
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-600 dark:text-slate-400">Itens por página</label>
            <select v-model.number="page.size"
              class="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              @change="onPageSizeChange">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>

            <div class="ml-2 inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
              <button
                class="px-3 py-1.5 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 dark:text-slate-200"
                :disabled="page.index === 1 || loading" @click="goTo(page.index - 1)" title="Anterior">
                ‹
              </button>
              <button
                class="px-3 py-1.5 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 dark:text-slate-200"
                :disabled="page.index >= totalPages || loading" @click="goTo(page.index + 1)" title="Próxima">
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
import { onMounted, reactive, ref, computed } from 'vue'
import { http } from '../lib/http'

interface LogItem {
  id: number
  dataCriacao: string
  usuario: {
    id: number
    nome: string
    email: string
  } | null
  acao: string
  entidade: string
  entidadeId: number | null
  descricao: string | null
  ip: string | null
  userAgent: string | null
  dadosAntes: string | null
  dadosDepois: string | null
}

const entityOptions = [
  { label: 'Todos', value: '' },
  { label: 'Usuário', value: 'Usuario' },
  { label: 'Empresa', value: 'Empresa' },
  { label: 'Proposta', value: 'Proposta' },
  { label: 'Contrato', value: 'Contrato' },
  { label: 'Tarefa', value: 'Tarefa' }
]

const query = reactive({
  entity: '',
  startDate: '',
  endDate: ''
})

const page = reactive({
  index: 1,
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

  try {
    const params: any = {
      page: page.index,
      limit: page.size
    }

    if (query.entity) {
      params.entidade = query.entity
    }

    if (query.startDate) {
      params.dataInicio = query.startDate
    }

    if (query.endDate) {
      params.dataFim = query.endDate
    }

    const queryString = new URLSearchParams(params).toString()
    const response = await http(`/api/auditorias?${queryString}`)

    items.value = response.registros
    page.total = response.total
  } catch (err) {
    console.error('[Auditoria] fetchData error:', err)
    items.value = []
    page.total = 0
  } finally {
    loading.value = false
  }
}

function onFilterChange() {
  page.index = 1
  fetchData()
}

function onPageSizeChange() {
  page.index = 1
  fetchData()
}

function goTo(nextIndex: number) {
  page.index = Math.min(Math.max(1, nextIndex), Math.max(1, totalPages.value))
  fetchData()
}

const exporting = ref(false)

async function onExport() {
  try {
    exporting.value = true

    const params: any = {
      // Exporta todos os registros filtrados, não apenas a página atual
      page: 1,
      limit: 10000 // Limite alto para pegar todos os registros
    }

    if (query.entity) {
      params.entidade = query.entity
    }

    if (query.startDate) {
      params.dataInicio = query.startDate
    }

    if (query.endDate) {
      params.dataFim = query.endDate
    }

    const queryString = new URLSearchParams(params).toString()

    // Fazer download do Excel
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auditorias/export/excel?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na resposta:', errorText)
      throw new Error('Erro ao exportar planilha')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    // Nome do arquivo com data e filtros aplicados
    let fileName = `auditoria_${new Date().toISOString().split('T')[0]}`
    if (query.entity) fileName += `_${query.entity}`
    if (query.startDate || query.endDate) {
      fileName += `_periodo`
      if (query.startDate) fileName += `_${query.startDate}`
      if (query.endDate) fileName += `_${query.endDate}`
    }
    a.download = `${fileName}.xlsx`

    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    console.error('[Auditoria] onExport error:', err)
    alert('Erro ao exportar planilha. Verifique sua conexão e tente novamente.')
  } finally {
    exporting.value = false
  }
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

onMounted(fetchData)
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
