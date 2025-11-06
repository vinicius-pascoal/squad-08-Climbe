<template>
  <div class=" ">
    <h1 class="font-bold mb-10 text-4xl">Gestão de Empresas</h1>
    <div class="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[280px,1fr]">
      <aside class="space-y-4">
        <div class="rounded-2xl bg-white p-4 shadow">
          <div class="space-y-3">
            <label class="block">
              <span class="text-xs font-medium text-slate-600">CNPJ</span>
              <div
                class="mt-1 inline-flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-sidebar focus-within:ring-2 focus-within:ring-sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-slate-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h8" />
                </svg>
                <input v-model="filters.cnpj" @keyup.enter="doSearch" placeholder="Digite o CNPJ"
                  class="w-full bg-transparent text-sm outline-none" />
              </div>
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-600">Representante Legal</span>
              <div
                class="mt-1 inline-flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-sidebar focus-within:ring-2 focus-within:ring-sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-slate-500" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9a7 7 0 0 1 14 0z" />
                </svg>
                <input v-model="filters.representative" @keyup.enter="doSearch" placeholder="Nome do representante"
                  class="w-full bg-transparent text-sm outline-none" />
              </div>
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-600">E-mail</span>
              <div
                class="mt-1 inline-flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-sidebar focus-within:ring-2 focus-within:ring-sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-slate-500" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5Zm2.05.128 7.45 4.653a1 1 0 0 0 1.01 0l7.44-4.645A1.5 1.5 0 0 0 19.5 5.5h-15a1.5 1.5 0 0 0-.45.128Z" />
                </svg>
                <input v-model="filters.email" @keyup.enter="doSearch" placeholder="email@empresa.com"
                  class="w-full bg-transparent text-sm outline-none" />
              </div>
            </label>

            <button @click="doSearch" :disabled="loading"
              class="mt-2 w-full rounded-xl bg-sidebar py-2 text-sm font-semibold text-white shadow hover:bg-secondary disabled:opacity-60">
              Buscar Empresa...
            </button>
          </div>
        </div>

        <nav class="space-y-3">
          <div class="flex items-center gap-3 rounded-xl bg-white p-3 shadow hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M7 3h10a2 2 0 0 1 2 2v6H5V5a2 2 0 0 1 2-2Zm-2 10h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
            </svg>
            <span class="text-sm font-medium text-slate-800">Propostas</span>
          </div>
          <div class="flex items-center gap-3 rounded-xl bg-white p-3 shadow hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M4 6a2 2 0 0 1 2-2h6l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
            </svg>
            <span class="text-sm font-medium text-slate-800">Contratos Ativos</span>
          </div>
          <div class="flex items-center gap-3 rounded-xl bg-white p-3 shadow hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24"
              fill="currentColor">
              <path
                d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v3h18V6a2 2 0 0 0-2-2ZM3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10H3Z" />
            </svg>
            <span class="text-sm font-medium text-slate-800">Última Atualização</span>
          </div>
        </nav>

        <button v-if="currentUser && (currentUser.value?.cargoNome === 'Admin')"
          class="w-full rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-3 text-left font-medium text-indigo-700 shadow hover:bg-indigo-100"
          @click="onCreate">
          Cadastrar Empresa
        </button>
        <button v-else disabled
          class="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 text-left text-gray-500">Sem
          permissão</button>
      </aside>

      <section class="rounded-2xl bg-white p-4 shadow">
        <header class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-base font-semibold text-slate-800">Empresas</h2>
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-600">Linhas</label>
            <select v-model.number="pageSize" class="rounded-lg border border-slate-300 bg-white p-1.5 text-xs">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
        </header>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500">
                <th class="px-3 py-2 font-semibold">Nome</th>
                <th class="px-3 py-2 font-semibold">CNPJ</th>
                <th class="px-3 py-2 font-semibold">E-mail do Representante</th>
                <th class="px-3 py-2 font-semibold">Status</th>
                <th class="px-3 py-2 font-semibold text-center">Ações</th>
              </tr>
            </thead>

            <tbody v-if="loading">
              <tr v-for="n in 8" :key="`sk-${n}`" class="border-b border-slate-100">
                <td class="px-3 py-3">
                  <div class="h-3 w-24 animate-pulse rounded bg-slate-200"></div>
                </td>
                <td class="px-3 py-3">
                  <div class="h-3 w-28 animate-pulse rounded bg-slate-200"></div>
                </td>
                <td class="px-3 py-3">
                  <div class="h-3 w-52 animate-pulse rounded bg-slate-200"></div>
                </td>
                <td class="px-3 py-3">
                  <div class="h-6 w-16 animate-pulse rounded-full bg-slate-200"></div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr v-if="companies.length === 0">
                <td colspan="4" class="px-3 py-8 text-center text-sm text-slate-500">
                  Nenhum registro encontrado.
                </td>
              </tr>

              <tr v-for="c in companies" :key="c.id" class="border-b border-slate-100 hover:bg-slate-50/60">
                <td class="px-3 py-3 font-semibold text-slate-800">{{ c.name }}</td>
                <td class="px-3 py-3 tabular-nums text-slate-700">{{ c.cnpj }}</td>
                <td class="px-3 py-3 text-slate-700">
                  <span class="block max-w-[280px] truncate md:max-w-none">{{ c.representativeEmail }}</span>
                </td>
                <td class="px-3 py-3">
                  <span :class="statusClasses(c.status)">{{ c.status }}</span>
                </td>
                <td class="px-3 py-3 text-center space-x-2">
                  <button @click="openFluxo(c.id)"
                    class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">Iniciar
                    fluxo</button>
                  <button v-if="activeFlowFor(c.id)" @click="openAdvance(activeFlowFor(c.id)!.id, c.id)"
                    class="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50">Avançar
                    etapa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs text-slate-500">
            Exibindo {{ pageStart }}–{{ pageEnd }} de {{ total }} registros
          </p>

          <div class="flex items-center gap-1">
            <button
              class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm hover:bg-slate-50 disabled:opacity-50"
              :disabled="page === 1 || loading" @click="goToPage(page - 1)">
              Anterior
            </button>

            <button v-for="p in visiblePages" :key="p.key" :disabled="p.isEllipsis || loading"
              @click="!p.isEllipsis && goToPage(p.num)" :class="[
                'h-9 min-w-[2.25rem] rounded-lg px-2 text-sm',
                p.isEllipsis
                  ? 'cursor-default border border-transparent'
                  : p.num === page
                    ? 'bg-sidebar text-white'
                    : 'border border-slate-300 bg-white hover:bg-slate-50'
              ]">
              {{ p.label }}
            </button>

            <button
              class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm hover:bg-slate-50 disabled:opacity-50"
              :disabled="page >= pageCount || loading" @click="goToPage(page + 1)">
              Próximo
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>

  <CompanyWizard v-model:open="wizardOpen" api-url="/api/empresas" @saved="handleSaved" />
  <ModalIniciarFluxo v-if="fluxoOpen" :empresa-id="fluxoEmpresaId" @close="fluxoOpen = false" @started="onFlowStarted" />

  <!-- Modal avançar etapa -->
  <div v-if="advanceOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
      <header class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">Agendar próxima etapa</h3>
        <button class="text-slate-500 hover:text-slate-700" @click="advanceOpen = false">✕</button>
      </header>
      <div class="grid grid-cols-2 gap-2">
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-slate-600">Data</span>
          <input type="date" v-model="advanceDate" class="w-full rounded-lg border border-slate-300 p-2 text-sm" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-slate-600">Hora</span>
          <input type="time" v-model="advanceTime" class="w-full rounded-lg border border-slate-300 p-2 text-sm" />
        </label>
      </div>
      <footer class="mt-4 flex justify-end gap-2">
        <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm"
          @click="advanceOpen = false">Cancelar</button>
        <button type="button" :disabled="advancing"
          class="rounded-lg bg-sidebar px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          @click="confirmAdvance">{{ advancing ? 'Avançando...' : 'Confirmar' }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, getCurrentInstance } from 'vue'
import CompanyWizard from '../components/modals/company-wizard/CompanyWizard.vue'
import ModalIniciarFluxo from '../components/modals/ModalIniciarFluxo.vue'
import { http } from '../lib/http'
import { currentUser } from '../services/auth'
import { listMyFlows, advanceFlow } from '../services/flow'

type Status = 'Ativa' | 'Pendente' | 'Inativa'
type Company = {
  id: number
  name: string
  cnpj: string
  representativeEmail: string
  status: Status
}

const instance = getCurrentInstance();
const notify = instance?.appContext.config.globalProperties.$notify;

const filters = ref({
  cnpj: '',
  representative: '',
  email: '',
})

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const companies = ref<Company[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const wizardOpen = ref(false)
const fluxoOpen = ref(false)
const fluxoEmpresaId = ref<number | undefined>(undefined)
const myFlows = ref<any[]>([])
const advanceOpen = ref(false)
const advanceFlowId = ref<number | null>(null)
const advanceEmpresaId = ref<number | null>(null)
const advancing = ref(false)
const advanceDate = ref('')
const advanceTime = ref('')
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const pageStart = computed(() => (total.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1))
const pageEnd = computed(() => Math.min(total.value, page.value * pageSize.value))

const visiblePages = computed(() => {
  const n = pageCount.value
  const cur = page.value
  const parts: Array<number | '…'> = []
  if (n <= 7) {
    for (let i = 1; i <= n; i++) parts.push(i)
  } else {
    parts.push(1)
    if (cur > 3) parts.push('…')
    const s = Math.max(2, cur - 1)
    const e = Math.min(n - 1, cur + 1)
    for (let i = s; i <= e; i++) parts.push(i)
    if (cur < n - 2) parts.push('…')
    parts.push(n)
  }
  return parts.map((p, i) =>
    p === '…'
      ? { key: `e-${i}`, isEllipsis: true as const, num: -1, label: '…' }
      : { key: `p-${p}`, isEllipsis: false as const, num: p as number, label: String(p) },
  )
})

function statusClasses(status: Status) {
  if (status === 'Ativa') return 'inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-sidebar ring-1 ring-primary/40'
  if (status === 'Pendente') return 'inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200'
  return 'inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200'
}

function goToPage(p: number) {
  if (p < 1 || p > pageCount.value || p === page.value) return
  page.value = p
}

function doSearch() {
  page.value = 1
  fetchCompanies()
}

async function fetchCompanies() {
  loading.value = true
  error.value = null

  try {
    const data = await http('/api/empresas')

    // Mapear dados do backend para o formato esperado
    const allCompanies = (Array.isArray(data) ? data : []).map((emp: any) => ({
      id: emp.id,
      name: emp.nomeFantasia || emp.razaoSocial || 'Sem nome',
      cnpj: emp.cnpj || 'N/A',
      representativeEmail: emp.email || 'Não informado',
      status: 'Ativa' as Status, // Backend não tem status, assumir Ativa
    }))

    // Aplicar filtros localmente
    const filtered = allCompanies.filter((m: Company) =>
      (!filters.value.cnpj || m.cnpj.includes(filters.value.cnpj)) &&
      (!filters.value.representative || m.name.toLowerCase().includes(filters.value.representative.toLowerCase())) &&
      (!filters.value.email || m.representativeEmail.toLowerCase().includes(filters.value.email.toLowerCase())),
    )

    total.value = filtered.length
    const start = (page.value - 1) * pageSize.value
    companies.value = filtered.slice(start, start + pageSize.value)
  } catch (e: any) {
    error.value = e?.message ?? 'Erro ao carregar empresas'
    notify?.error(error.value)
  } finally {
    loading.value = false
  }
}

function handleSaved() {
  fetchCompanies()
  notify?.success('Empresa salva com sucesso!')
}

function onCreate() {
  wizardOpen.value = true
}

function openFluxo(empresaId: number) {
  fluxoEmpresaId.value = empresaId
  fluxoOpen.value = true
}

function onFlowStarted(_flow: any) {
  // opcional: feedback extra
}

function activeFlowFor(empresaId: number) {
  return myFlows.value.find((f: any) => f.empresaId === empresaId && f.status !== 'CONCLUIDO' && f.status !== 'CANCELADO')
}

function openAdvance(flowId: number, empresaId: number) {
  advanceFlowId.value = flowId
  advanceEmpresaId.value = empresaId
  advanceDate.value = ''
  advanceTime.value = ''
  advanceOpen.value = true
}

function toIso(date: string, time: string) {
  if (!date) return undefined
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  if (time) {
    const [hh, mm] = time.split(':').map(Number)
    dt.setHours(hh || 9, mm || 0, 0, 0)
  }
  return dt.toISOString()
}

async function confirmAdvance() {
  try {
    if (!advanceFlowId.value) return
    advancing.value = true
    const iso = toIso(advanceDate.value, advanceTime.value)
    await advanceFlow(advanceFlowId.value, iso)
    notify?.success?.('Próxima etapa criada e notificada')
    advanceOpen.value = false
    await fetchMyFlows()
  } catch (e: any) {
    notify?.error?.(e?.message || 'Falha ao avançar etapa')
  } finally {
    advancing.value = false
  }
}

async function fetchMyFlows() {
  try {
    const data = await listMyFlows()
    myFlows.value = Array.isArray(data) ? data : []
  } catch (e) { /* ignore */ }
}

watch([page, pageSize], fetchCompanies)
onMounted(() => { fetchCompanies(); fetchMyFlows(); })
</script>

<style scoped></style>
