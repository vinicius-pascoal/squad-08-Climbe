<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Propostas para Validação Financeira</h3>
    <div v-if="loadingPropostas" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Carregando propostas...
    </div>
    <div v-else-if="propostasPendentes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Nenhuma proposta pendente de validação financeira
    </div>
    <div v-else class="space-y-4">
      <div v-for="proposta in propostasPendentes.slice(0, 5)" :key="proposta.id"
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">{{ proposta.titulo || `Proposta #${proposta.id}` }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Valor: {{ formatarValor(proposta.valor_total) }} | Status: {{ formatarStatus(proposta.status) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="validarProposta(proposta.id)" :disabled="processando === proposta.id"
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50">
            {{ processando === proposta.id ? 'Validando...' : 'Validar' }}
          </button>
          <button @click="rejeitarProposta(proposta.id)" :disabled="processando === proposta.id"
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50">
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Gerenciar Alocação de Analistas</h3>
    <div v-if="loadingContratos || loadingAnalistas" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Carregando dados...
    </div>
    <div v-else class="space-y-4">
      <div
        class="flex items-end gap-4 p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contrato</label>
          <select v-model="contratoSelecionado"
            class="mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2">
            <option value="">Selecione um contrato</option>
            <option v-for="contrato in contratos" :key="contrato.id" :value="contrato.id">
              Contrato #{{ contrato.id }} - {{ contrato.nome_cliente }}
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Analista</label>
          <select v-model="analistaSelecionado"
            class="mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2">
            <option value="">Selecione um analista</option>
            <option v-for="analista in analistas" :key="analista.id" :value="analista.id">
              {{ analista.nome }}
            </option>
          </select>
        </div>
        <button @click="alocarAnalista" :disabled="!contratoSelecionado || !analistaSelecionado || alocando"
          class="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {{ alocando ? 'Alocando...' : 'Alocar' }}
        </button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { http } from '../../lib/http'

const propostasPendentes = ref<any[]>([])
const contratos = ref<any[]>([])
const analistas = ref<any[]>([])
const loadingPropostas = ref(true)
const loadingContratos = ref(true)
const loadingAnalistas = ref(true)
const processando = ref<number | null>(null)
const alocando = ref(false)
const contratoSelecionado = ref('')
const analistaSelecionado = ref('')

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
    const response = await http('/api/propostas')
    // Filtrar propostas que precisam de validação financeira
    propostasPendentes.value = response.data.filter((proposta: any) =>
      proposta.status === 'em_analise' || proposta.status === 'aguardando_aprovacao'
    )
  } catch (error) {
    console.error('Erro ao carregar propostas:', error)
    propostasPendentes.value = []
  } finally {
    loadingPropostas.value = false
  }
}

const carregarContratos = async () => {
  try {
    loadingContratos.value = true
    const response = await http('/api/contratos')
    // Filtrar contratos ativos
    contratos.value = response.data.filter((contrato: any) => contrato.status === 'ativo')
  } catch (error) {
    console.error('Erro ao carregar contratos:', error)
    contratos.value = []
  } finally {
    loadingContratos.value = false
  }
}

const carregarAnalistas = async () => {
  try {
    loadingAnalistas.value = true
    const response = await http('/api/usuarios')
    // Filtrar apenas analistas
    analistas.value = response.data.filter((usuario: any) =>
      usuario.cargo?.nome?.toLowerCase().includes('analista')
    )
  } catch (error) {
    console.error('Erro ao carregar analistas:', error)
    analistas.value = []
  } finally {
    loadingAnalistas.value = false
  }
}

const validarProposta = async (propostaId: number) => {
  try {
    processando.value = propostaId
    await http(`/api/propostas/${propostaId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'aprovada' })
    })
    await carregarPropostas()
    alert('Proposta validada com sucesso!')
  } catch (error) {
    console.error('Erro ao validar proposta:', error)
    alert('Erro ao validar proposta')
  } finally {
    processando.value = null
  }
}

const rejeitarProposta = async (propostaId: number) => {
  try {
    processando.value = propostaId
    await http(`/api/propostas/${propostaId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'rejeitada' })
    })
    await carregarPropostas()
    alert('Proposta rejeitada')
  } catch (error) {
    console.error('Erro ao rejeitar proposta:', error)
    alert('Erro ao rejeitar proposta')
  } finally {
    processando.value = null
  }
}

const alocarAnalista = async () => {
  if (!contratoSelecionado.value || !analistaSelecionado.value) return

  try {
    alocando.value = true
    // Atualizar o contrato com o analista responsável
    await http(`/api/contratos/${contratoSelecionado.value}`, {
      method: 'PUT',
      body: JSON.stringify({ responsavel_id: analistaSelecionado.value })
    })
    alert('Analista alocado com sucesso!')
    contratoSelecionado.value = ''
    analistaSelecionado.value = ''
    await carregarContratos()
  } catch (error) {
    console.error('Erro ao alocar analista:', error)
    alert('Erro ao alocar analista')
  } finally {
    alocando.value = false
  }
}

onMounted(() => {
  carregarPropostas()
  carregarContratos()
  carregarAnalistas()
})
</script>

<style scoped></style>
