<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-brand-000 dark:text-white">Tarefas da Proposta #{{ propostaId }}</h1>
        <p class="text-sm text-brand-5f6060 dark:text-brand-e5e7eb">
          {{ tarefas.length }} tarefa(s) vinculada(s) a esta proposta
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button @click="openCreate"
          class="rounded-lg bg-brand-cad8fd dark:bg-brand-14b8a6 border border-brand-3b67d0 dark:border-brand-0e9989 text-brand-3b67d0 dark:text-white font-semibold px-4 py-2 hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af transition">
          + Cadastrar tarefa
        </button>
        <button
          class="rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-white dark:bg-brand-0e9a97 text-brand-5f6060 dark:text-white px-4 py-2 hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 transition"
          @click="goBack">
          Voltar
        </button>
      </div>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <div class="inline-flex items-center gap-2 text-brand-5f6060 dark:text-brand-e5e7eb">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Carregando tarefas...
      </div>
    </div>
    <div v-else-if="!propostaId"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-red-600 dark:text-red-400">❌ ID da proposta não encontrado na URL</p>
    </div>
    <div v-else-if="tarefas.length === 0"
      class="bg-white dark:bg-brand-0a0a0a rounded-lg shadow p-8 text-center border border-brand-e5e7eb dark:border-brand-0e9989">
      <p class="text-brand-5f6060 dark:text-brand-e5e7eb mb-4">📋 Nenhuma tarefa encontrada para esta proposta</p>
      <button @click="openCreate"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-cad8fd dark:bg-brand-14b8a6 text-brand-3b67d0 dark:text-white font-semibold px-4 py-2 hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af transition">
        + Criar primeira tarefa
      </button>
    </div>
    <div v-else>
      <div
        class="bg-white dark:bg-brand-0a0a0a rounded-lg shadow p-4 border border-brand-e5e7eb dark:border-brand-0e9989">
        <TaskBoard :tasksData="tasksMapped" />
      </div>
    </div>

    <ModalCreateTarefa v-if="showCreateModal" :propostaId="propostaId" @close="showCreateModal = false"
      @saved="onCreated" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskBoard from '../components/TaskBoard.vue'
import ModalCreateTarefa from '../components/modals/ModalCreateTarefa.vue'
import { listTarefas } from '../services/tarefa'

const route = useRoute()
const router = useRouter()
// Pega o ID da proposta da URL (params.id ou query.propostaId)
const propostaId = computed(() => Number(route.params.id) || Number(route.query.propostaId) || 0)
const loading = ref(true)
const tarefas = ref<any[]>([])
const showCreateModal = ref(false)

const mapStatus = (s: string | undefined) => {
  if (!s) return 'todo'
  const st = s.toUpperCase()
  if (st.includes('FAZER') || st === 'A_FAZER' || st === 'PENDENTE') return 'todo'
  if (st.includes('AND') || st.includes('ANDAMENTO') || st === 'EM_ANDAMENTO') return 'doing'
  if (st.includes('REV') || st === 'REVISAO') return 'review'
  if (st.includes('CONCLU') || st === 'CONCLUIDA' || st === 'DONE') return 'done'
  return 'todo'
}

function toTask(t: any) {
  return {
    id: String(t.id),
    title: t.titulo || t.title || 'Tarefa',
    tag: (t.categoria as any) || (t.tag as any) || 'Desenvolvimento',
    status: mapStatus(t.status) as any,
    points: 1,
    date: t.dataCriacao ? new Date(t.dataCriacao).toLocaleDateString('pt-BR') : '',
    responsavel: t.usuario?.nomeCompleto || t.usuario?.email || (t.usuarioId ? 'Usuário ' + t.usuarioId : undefined)
  }
}

const tasksMapped = computed(() => tarefas.value.map(toTask))

async function load() {
  if (!propostaId.value) {
    console.warn('PropostaId não encontrado na URL')
    loading.value = false
    return
  }

  loading.value = true
  try {
    console.log(`Carregando tarefas da proposta #${propostaId.value}`)
    const data = await listTarefas(propostaId.value)
    tarefas.value = data || []
    console.log(`${tarefas.value.length} tarefa(s) carregada(s)`)
  } catch (e) {
    console.error('Erro ao carregar tarefas:', e)
    tarefas.value = []
  } finally {
    loading.value = false
  }
}

function goBack() { router.back() }

function openCreate() {
  showCreateModal.value = true
}

async function onCreated(_newTarefa: any) {
  // reload tasks from server to ensure consistency
  await load()
}

// Recarrega tarefas quando o propostaId muda na URL
watch(() => propostaId.value, (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log(`PropostaId mudou de ${oldId} para ${newId}, recarregando tarefas...`)
    load()
  }
}, { immediate: false })

onMounted(() => load())
</script>

<style scoped></style>
