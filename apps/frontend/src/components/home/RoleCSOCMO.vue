<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Minhas Propostas Comerciais</h3>
    <div v-if="loadingPropostas" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Carregando propostas...
    </div>
    <div v-else-if="minhasPropostas.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Você ainda não criou nenhuma proposta comercial
    </div>
    <div v-else class="space-y-4">
      <div v-for="proposta in minhasPropostas.slice(0, 5)" :key="proposta.id"
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">{{ proposta.titulo || `Proposta #${proposta.id}` }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Status: <span :class="getClasseStatus(proposta.status)">{{ formatarStatus(proposta.status) }}</span>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Valor: {{ formatarValor(proposta.valor_total) }}
          </p>
        </div>
        <div class="flex gap-2">
          <router-link :to="`/propostas?id=${proposta.id}`"
            class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Ver
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos</h3>
    <div class="grid grid-cols-2 gap-4">
      <button @click="props.openCreateProposta?.()"
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-green-700 dark:text-green-300 w-full hover:bg-green-50 dark:hover:bg-green-900">
        Nova Proposta
      </button>
      <router-link to="/contratos"
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-green-700 dark:text-green-300 w-full hover:bg-green-50 dark:hover:bg-green-900 text-center">
        Ver Contratos
      </router-link>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none actions-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Estatísticas</h3>
    <div v-if="loadingEstatisticas" class="text-center py-4 text-gray-500 dark:text-gray-400">
      Carregando...
    </div>
    <div v-else class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Total de Propostas:</span>
        <span class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ estatisticas.total }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Aprovadas:</span>
        <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ estatisticas.aprovadas }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Em Análise:</span>
        <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">{{ estatisticas.emAnalise }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { http } from '../../lib/http'
import { currentUser } from '../../services/auth'

const props = defineProps<{
  openCreateProposta?: () => void
}>()

const minhasPropostas = ref<any[]>([])
const loadingPropostas = ref(true)
const loadingEstatisticas = ref(true)

const estatisticas = computed(() => {
  return {
    total: minhasPropostas.value.length,
    aprovadas: minhasPropostas.value.filter(p => p.status === 'aprovada').length,
    emAnalise: minhasPropostas.value.filter(p => p.status === 'em_analise' || p.status === 'aguardando_aprovacao').length
  }
})

const formatarStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'rascunho': 'Rascunho',
    'em_analise': 'Em Análise',
    'aprovada': 'Aprovada',
    'rejeitada': 'Rejeitada',
    'aguardando_aprovacao': 'Aguardando Aprovação'
  }
  return statusMap[status] || status
}

const getClasseStatus = (status: string) => {
  const classeMap: Record<string, string> = {
    'rascunho': 'font-medium text-gray-600 dark:text-gray-400',
    'em_analise': 'font-medium text-blue-600 dark:text-blue-400',
    'aprovada': 'font-medium text-green-600 dark:text-green-400',
    'rejeitada': 'font-medium text-red-600 dark:text-red-400',
    'aguardando_aprovacao': 'font-medium text-yellow-600 dark:text-yellow-400'
  }
  return classeMap[status] || 'font-medium'
}

const formatarValor = (valor: number) => {
  if (!valor) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const carregarPropostas = async () => {
  try {
    loadingPropostas.value = true
    loadingEstatisticas.value = true
    const response = await http('/api/propostas')
    // Filtrar propostas do usuário atual (CSO/CMO)
    if (currentUser.value?.id) {
      minhasPropostas.value = response.data.filter((proposta: any) =>
        proposta.criador_id === currentUser.value?.id
      )
    } else {
      minhasPropostas.value = response.data
    }
  } catch (error) {
    console.error('Erro ao carregar propostas:', error)
    minhasPropostas.value = []
  } finally {
    loadingPropostas.value = false
    loadingEstatisticas.value = false
  }
}

onMounted(() => {
  carregarPropostas()
})
</script>

<style scoped></style>
