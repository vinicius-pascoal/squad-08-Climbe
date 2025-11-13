<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Contratos Pendentes de Revisão</h3>
    <div v-if="loadingContratos" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Carregando contratos...
    </div>
    <div v-else-if="contratosPendentes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Nenhum contrato pendente de revisão
    </div>
    <div v-else class="space-y-4">
      <div v-for="contrato in contratosPendentes.slice(0, 5)" :key="contrato.id"
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium">{{ contrato.nome_cliente || `Contrato #${contrato.id}` }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Status: {{ formatarStatus(contrato.status) }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Data: {{ formatarData(contrato.data_inicio) }}</p>
        </div>
        <div class="flex gap-2">
          <router-link :to="`/contratos?id=${contrato.id}`"
            class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Abrir
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos de Compliance</h3>
    <div class="grid grid-cols-2 gap-4">
      <button @click="props.openNovoContrato?.()"
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-red-700 dark:text-red-300 w-full hover:bg-red-100 dark:hover:bg-red-600">Novo
        Contrato</button>
      <router-link to="/contratos"
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-red-700 dark:text-red-300 w-full hover:bg-red-100 dark:hover:bg-red-600 text-center">
        Revisar Docs
      </router-link>
      <router-link to="/usuarios"
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-red-700 dark:text-red-300 w-full hover:bg-red-100 dark:hover:bg-red-600 text-center">
        Aprovar Usuário
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { http } from '../../lib/http'

const props = defineProps<{
  openNovoContrato?: () => void
}>()

const contratosPendentes = ref<any[]>([])
const loadingContratos = ref(true)

const formatarStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'rascunho': 'Rascunho',
    'em_analise': 'Em Análise',
    'aguardando_assinatura': 'Aguardando Assinatura',
    'ativo': 'Ativo',
    'encerrado': 'Encerrado',
    'cancelado': 'Cancelado'
  }
  return statusMap[status] || status
}

const formatarData = (data: string) => {
  if (!data) return 'N/A'
  return new Date(data).toLocaleDateString('pt-BR')
}

const carregarContratos = async () => {
  try {
    loadingContratos.value = true
    const response = await http('/api/contratos')
    // Filtrar contratos pendentes de revisão (em análise ou aguardando assinatura)
    contratosPendentes.value = response.data.filter((contrato: any) =>
      contrato.status === 'em_analise' || contrato.status === 'aguardando_assinatura'
    )
  } catch (error) {
    console.error('Erro ao carregar contratos:', error)
    contratosPendentes.value = []
  } finally {
    loadingContratos.value = false
  }
}

onMounted(() => {
  carregarContratos()
})
</script>

<style scoped></style>
