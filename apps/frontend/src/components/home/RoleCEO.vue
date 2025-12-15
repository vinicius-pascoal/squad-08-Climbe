<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <!-- KPIs compactos -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-blue-100 rounded-lg"><i data-lucide="building-2" class="text-blue-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.empresas }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Empresas</p>
        </div>
      </div>
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-sky-100 rounded-lg"><i data-lucide="users" class="text-sky-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.usuarios }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Usuários</p>
        </div>
      </div>
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-amber-100 rounded-lg"><i data-lucide="presentation" class="text-amber-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.propostas }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Propostas</p>
        </div>
      </div>
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-rose-100 rounded-lg"><i data-lucide="file-check" class="text-rose-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.aprovacoesPendentes }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Aprovações</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Aprovações Pendentes</h3>

    <div v-if="loadingAprovacoes" class="text-center py-4 text-gray-500 dark:text-gray-400">
      Carregando...
    </div>

    <div v-else-if="!aprovacoesPendentes.length" class="text-center py-6 text-gray-500 dark:text-gray-400">
      Nenhuma aprovação pendente
    </div>

    <div v-else class="space-y-4">
      <!-- Propostas Pendentes -->
      <div v-for="proposta in propostasPendentes" :key="`proposta-${proposta.id}`"
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">
            Validar Proposta Comercial #{{ proposta.id }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ proposta.empresa?.razaoSocial || 'Empresa não especificada' }}
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="aprovarProposta(proposta.id)" :disabled="processando[`proposta-${proposta.id}`]"
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50">
            {{ processando[`proposta-${proposta.id}`] ? 'Processando...' : 'Aprovar' }}
          </button>
          <button @click="reprovarProposta(proposta.id)" :disabled="processando[`proposta-${proposta.id}`]"
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50">
            Reprovar
          </button>
        </div>
      </div>

      <!-- Usuários Pendentes -->
      <div v-for="usuario in usuariosPendentes" :key="`usuario-${usuario.id}`"
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">
            Aprovar novo usuário: {{ usuario.nome }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Cargo: {{ usuario.cargo?.nome || 'Não especificado' }}
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="aprovarUsuario(usuario.id)" :disabled="processando[`usuario-${usuario.id}`]"
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50">
            {{ processando[`usuario-${usuario.id}`] ? 'Processando...' : 'Aprovar' }}
          </button>
          <button @click="reprovarUsuario(usuario.id)" :disabled="processando[`usuario-${usuario.id}`]"
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50">
            Reprovar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none actions-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Ações Rápidas</h3>
    <div class="space-y-3">
      <!-- Iniciar Jornada -->
      <button v-if="props.openIniciarFluxo" @click="props.openIniciarFluxo()"
        class="w-full p-5 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center gap-4">
        <div class="p-3 bg-white/20 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div class="text-left flex-1">
          <p class="font-bold text-base">Iniciar Jornada de Contrato</p>
          <p class="text-sm opacity-90 mt-1">Inicie um novo processo de cadastro de empresa</p>
        </div>
        <svg class="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import { http } from '../../lib/http';

const props = defineProps<{
  openIniciarFluxo?: () => void
}>()

const stats = ref({
  empresas: 0,
  usuarios: 0,
  propostas: 0,
  aprovacoesPendentes: 0
});

const aprovacoesPendentes = ref<any[]>([]);
const loadingAprovacoes = ref(false);
const processando = ref<Record<string, boolean>>({});

const propostasPendentes = computed(() =>
  aprovacoesPendentes.value.filter(item => item.tipo === 'proposta')
);

const usuariosPendentes = computed(() =>
  aprovacoesPendentes.value.filter(item => item.tipo === 'usuario')
);

async function carregarStats() {
  try {
    const [empresasRes, usuariosRes, propostasRes] = await Promise.all([
      http('/api/empresas'),
      http('/api/usuarios'),
      http('/api/propostas')
    ]);

    stats.value.empresas = empresasRes.length || 0;
    stats.value.usuarios = usuariosRes.length || 0;
    stats.value.propostas = propostasRes.length || 0;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

async function carregarAprovacoesPendentes() {
  loadingAprovacoes.value = true;
  try {
    const [propostas, usuarios] = await Promise.all([
      http('/api/propostas'),
      http('/api/usuarios')
    ]);

    const pendentes: any[] = [];

    // Propostas pendentes de aprovação (status PENDENTE)
    const propostasPendentesData = propostas.filter((p: any) => p.status === 'PENDENTE');
    propostasPendentesData.forEach((p: any) => {
      pendentes.push({ ...p, tipo: 'proposta' });
    });

    // Usuários pendentes de aprovação (situacao PENDENTE)
    const usuariosPendentesData = usuarios.filter((u: any) => u.situacao === 'PENDENTE');
    usuariosPendentesData.forEach((u: any) => {
      pendentes.push({ ...u, tipo: 'usuario' });
    });

    aprovacoesPendentes.value = pendentes;
    stats.value.aprovacoesPendentes = pendentes.length;
  } catch (error) {
    console.error('Erro ao carregar aprovações pendentes:', error);
  } finally {
    loadingAprovacoes.value = false;
  }
}

async function aprovarProposta(id: number) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  processando.value[`proposta-${id}`] = true;
  try {
    await http(`/api/propostas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'APROVADA' })
    });

    $notify?.success?.('Proposta aprovada com sucesso!');
    await carregarAprovacoesPendentes();
  } catch (error: any) {
    $notify?.error?.(error?.message || 'Erro ao aprovar proposta');
  } finally {
    processando.value[`proposta-${id}`] = false;
  }
}

async function reprovarProposta(id: number) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  processando.value[`proposta-${id}`] = true;
  try {
    await http(`/api/propostas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REPROVADA' })
    });

    $notify?.success?.('Proposta reprovada');
    await carregarAprovacoesPendentes();
  } catch (error: any) {
    $notify?.error?.(error?.message || 'Erro ao reprovar proposta');
  } finally {
    processando.value[`proposta-${id}`] = false;
  }
}

async function aprovarUsuario(id: number) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  processando.value[`usuario-${id}`] = true;
  try {
    await http(`/api/usuarios/${id}/aprovar`, {
      method: 'PATCH',
      body: JSON.stringify({ situacao: 'ATIVO' })
    });

    $notify?.success?.('Usuário aprovado com sucesso!');
    await carregarAprovacoesPendentes();
  } catch (error: any) {
    $notify?.error?.(error?.message || 'Erro ao aprovar usuário');
  } finally {
    processando.value[`usuario-${id}`] = false;
  }
}

async function reprovarUsuario(id: number) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  processando.value[`usuario-${id}`] = true;
  try {
    await http(`/api/usuarios/${id}/aprovar`, {
      method: 'PATCH',
      body: JSON.stringify({ situacao: 'INATIVO' })
    });

    $notify?.success?.('Usuário reprovado');
    await carregarAprovacoesPendentes();
  } catch (error: any) {
    $notify?.error?.(error?.message || 'Erro ao reprovar usuário');
  } finally {
    processando.value[`usuario-${id}`] = false;
  }
}

onMounted(async () => {
  await Promise.all([
    carregarStats(),
    carregarAprovacoesPendentes()
  ]);
});
</script>

<style scoped></style>
