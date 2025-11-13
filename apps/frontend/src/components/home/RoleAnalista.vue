<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none w-full h-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Minhas Tarefas</h3>
    </div>

    <div v-if="loadingTarefas" class="text-center py-4 text-gray-500 dark:text-gray-400">
      Carregando...
    </div>

    <div v-else-if="!tarefas.length" class="text-center py-6 text-gray-500 dark:text-gray-400">
      Nenhuma tarefa atribuída
    </div>

    <div v-else class="space-y-4">
      <div v-for="tarefa in tarefas.slice(0, 3)" :key="tarefa.id"
        class="flex items-center gap-4 p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <i :data-lucide="getIconeTarefa(tarefa.status)" :class="getCorTarefa(tarefa)"></i>
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">{{ tarefa.titulo }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ tarefa.descricao || 'Sem descrição' }}
            <span v-if="tarefa.prazo"> | Prazo: {{ formatarData(tarefa.prazo) }}</span>
          </p>
        </div>
        <span v-if="isPrazoUrgente(tarefa.prazo)"
          class="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
          Urgente
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { http } from '../../lib/http';
import { currentUser } from '../../services/auth';

const tarefas = ref<any[]>([]);
const loadingTarefas = ref(false);

function getIconeTarefa(status: string) {
  const icones: Record<string, string> = {
    'PENDENTE': 'file-clock',
    'EM_ANDAMENTO': 'file-check-2',
    'CONCLUIDA': 'bar-chart-3',
    'CANCELADA': 'x-circle'
  };
  return icones[status] || 'file-text';
}

function getCorTarefa(tarefa: any) {
  if (isPrazoUrgente(tarefa.prazo)) return 'text-orange-500';

  const cores: Record<string, string> = {
    'PENDENTE': 'text-blue-500',
    'EM_ANDAMENTO': 'text-orange-500',
    'CONCLUIDA': 'text-green-500',
    'CANCELADA': 'text-gray-500'
  };
  return cores[tarefa.status] || 'text-gray-500';
}

function formatarData(data: string | null) {
  if (!data) return '';
  try {
    return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

function isPrazoUrgente(prazo: string | null) {
  if (!prazo) return false;
  try {
    const dataPrazo = new Date(prazo);
    const hoje = new Date();
    const diffDias = Math.ceil((dataPrazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias <= 3;
  } catch {
    return false;
  }
}

async function carregarTarefas() {
  loadingTarefas.value = true;
  try {
    const userId = currentUser.value?.id;
    if (!userId) return;

    const response = await http('/api/tarefas');
    // Filtrar tarefas do usuário atual
    tarefas.value = response.filter((t: any) =>
      t.usuarioId === userId || t.responsavelId === userId
    );
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  } finally {
    loadingTarefas.value = false;
  }
}

onMounted(() => {
  carregarTarefas();
});
</script>

<style scoped></style>
