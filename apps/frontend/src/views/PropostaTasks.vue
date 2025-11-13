<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold">Tarefas da Proposta</h1>
        <p class="text-sm text-slate-500">Visualize e gerencie as tarefas vinculadas a esta proposta</p>
      </div>

      <div class="flex items-center gap-3">
        <button @click="openCreate" class="rounded-lg bg-emerald-700 text-white px-4 py-2 hover:bg-emerald-800">
          Cadastrar tarefa
        </button>
        <button class="rounded-lg border px-3 py-1" @click="goBack">Voltar</button>
      </div>
    </div>

    <div v-if="loading" class="p-6">Carregando...</div>
    <div v-else>
      <div class="bg-white rounded-lg shadow p-4">
        <TaskBoard :tasksData="tasksMapped" />
      </div>
    </div>

    <ModalCreateTarefa v-if="showCreateModal" :propostaId="propostaId" @close="showCreateModal = false"
      @saved="onCreated" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskBoard from '../components/TaskBoard.vue'
import ModalCreateTarefa from '../components/modals/ModalCreateTarefa.vue'
import { listTarefas } from '../services/tarefa'

const route = useRoute()
const router = useRouter()
const propostaId = Number(route.params.id || route.query.propostaId || 0)
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
    date: t.dataCriacao ? new Date(t.dataCriacao).toLocaleDateString('pt-BR') : ''
  }
}

const tasksMapped = computed(() => tarefas.value.map(toTask))

async function load() {
  loading.value = true
  try {
    const data = await listTarefas(propostaId || undefined)
    tarefas.value = data || []
  } catch (e) {
    console.error('Erro ao carregar tarefas:', e)
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

onMounted(() => load())
</script>

<style scoped></style>
