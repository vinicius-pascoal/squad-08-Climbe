<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center" @click.self="close">
      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative z-10 w-[min(800px,95vw)] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Detalhes da Proposta</h2>
            <p class="text-sm text-slate-500">ID: {{ proposta?.id || 'N/A' }}</p>
          </div>
          <button @click="close" class="rounded-full p-2 hover:bg-slate-100 transition" title="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="none"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div v-if="loading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 6" :key="i" class="h-12 rounded-lg bg-slate-100 animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="proposta" class="p-6 space-y-6">
          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <span :class="statusBadgeClass"
              class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-2">
              {{ statusText }}
            </span>
            <span class="text-sm text-slate-500">
              Criada em {{ formatDate(proposta.dataCriacao) }}
            </span>
          </div>

          <!-- Empresa Info -->
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 3h10a2 2 0 0 1 2 2v6H5V5a2 2 0 0 1 2-2Zm-2 10h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
              </svg>
              Empresa
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 mb-1">Nome</p>
                <p class="text-sm font-medium text-slate-800">{{ proposta.empresa?.nomeFantasia ||
                  proposta.empresa?.razaoSocial || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">CNPJ</p>
                <p class="text-sm font-medium text-slate-800">{{ proposta.empresa?.cnpj || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">Email</p>
                <p class="text-sm font-medium text-slate-800">{{ proposta.empresa?.email || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">Telefone</p>
                <p class="text-sm font-medium text-slate-800">{{ proposta.empresa?.telefone || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Responsável Info -->
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9a7 7 0 0 1 14 0z" />
              </svg>
              Responsável
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 mb-1">Nome</p>
                <p class="text-sm font-medium text-slate-800">{{ proposta.usuario?.nomeCompleto || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">Email</p>
                <p class="text-sm font-medium text-slate-800">{{ proposta.usuario?.email || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Contratos Relacionados -->
          <div v-if="proposta.contratos && proposta.contratos.length > 0"
            class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6a2 2 0 0 1 2-2h6l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
              </svg>
              Contratos Associados ({{ proposta.contratos.length }})
            </h3>
            <div class="space-y-2">
              <div v-for="contrato in proposta.contratos" :key="contrato.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <p class="text-sm font-medium text-slate-800">{{ contrato.nome }}</p>
                  <p class="text-xs text-slate-500">Valor: R$ {{ formatCurrency(contrato.valor) }}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {{ contrato.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="proposta.status === 'PENDENTE' || proposta.status === 'REVISAO'"
            class="border-t border-slate-200 pt-4 space-y-3">
            <h3 class="text-sm font-semibold text-slate-700">Ações</h3>

            <div class="flex flex-wrap gap-3">
              <button @click="updateStatus('APROVADA')" :disabled="updating"
                class="flex-1 min-w-[140px] rounded-lg bg-emerald-600 text-white font-semibold px-4 py-3 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ updating ? 'Aprovando...' : 'Aprovar' }}
              </button>

              <button @click="updateStatus('REVISAO')" :disabled="updating"
                class="flex-1 min-w-[140px] rounded-lg bg-amber-600 text-white font-semibold px-4 py-3 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ updating ? 'Atualizando...' : 'Enviar para Revisão' }}
              </button>

              <button @click="updateStatus('REPROVADA')" :disabled="updating"
                class="flex-1 min-w-[140px] rounded-lg bg-rose-600 text-white font-semibold px-4 py-3 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ updating ? 'Reprovando...' : 'Reprovar' }}
              </button>
            </div>
          </div>

          <div v-else class="border-t border-slate-200 pt-4">
            <p class="text-sm text-slate-600 text-center">
              Esta proposta já foi {{ proposta.status === 'APROVADA' ? 'aprovada' : 'reprovada' }}.
            </p>
          </div>
        </div>

        <div v-else class="p-6 text-center text-slate-500">
          Proposta não encontrada.
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end">
          <button @click="close"
            class="rounded-lg bg-slate-200 text-slate-700 font-medium px-6 py-2 hover:bg-slate-300 transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { http } from '../../lib/http'

type Status = 'APROVADA' | 'REVISAO' | 'REPROVADA' | 'PENDENTE'

interface Props {
  open: boolean
  propostaId: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'updated'): void
}>()

const instance = getCurrentInstance()
const notify = instance?.appContext.config.globalProperties.$notify

const loading = ref(false)
const updating = ref(false)
const proposta = ref<any>(null)

const statusText = computed(() => {
  if (!proposta.value) return ''
  const map: Record<Status, string> = {
    APROVADA: 'Aprovada',
    REVISAO: 'Em Revisão',
    REPROVADA: 'Reprovada',
    PENDENTE: 'Pendente'
  }
  return map[proposta.value.status as Status] || proposta.value.status
})

const statusBadgeClass = computed(() => {
  if (!proposta.value) return ''
  const status = proposta.value.status as Status
  const classes: Record<Status, string> = {
    APROVADA: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    REVISAO: 'bg-amber-100 text-amber-700 ring-amber-200',
    REPROVADA: 'bg-rose-100 text-rose-700 ring-rose-200',
    PENDENTE: 'bg-slate-100 text-slate-700 ring-slate-200'
  }
  return classes[status] || classes.PENDENTE
})

function close() {
  emit('update:open', false)
}

function formatDate(date: string | Date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Data inválida'
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(value: number | string) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num || 0)
}

async function fetchProposta() {
  if (!props.propostaId) return

  loading.value = true
  try {
    const data = await http(`/api/propostas/${props.propostaId}`)
    proposta.value = data
  } catch (error: any) {
    notify?.error(`Erro ao carregar proposta: ${error.message}`)
    close()
  } finally {
    loading.value = false
  }
}

async function updateStatus(newStatus: Status) {
  if (!proposta.value) return

  updating.value = true
  try {
    await http(`/api/propostas/${proposta.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    })

    proposta.value.status = newStatus

    const messages: Record<Status, string> = {
      APROVADA: 'Proposta aprovada com sucesso!',
      REVISAO: 'Proposta enviada para revisão!',
      REPROVADA: 'Proposta reprovada!',
      PENDENTE: 'Status atualizado para pendente!'
    }

    notify?.success(messages[newStatus])
    emit('updated')
  } catch (error: any) {
    notify?.error(`Erro ao atualizar proposta: ${error.message}`)
  } finally {
    updating.value = false
  }
}

watch(() => props.open, (isOpen) => {
  if (isOpen && props.propostaId) {
    fetchProposta()
  } else {
    proposta.value = null
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
