<template>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Auditoria do Sistema (Logs Recentes)</h3>
    <div class="space-y-3 text-sm font-mono bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto">
      <template v-if="loading">
        <p class="animate-pulse text-slate-300">Carregando logs...</p>
      </template>
      <template v-else>
        <p v-for="log in logs" :key="log.id">
          <span class="text-blue-300">[{{ formatDate(log.dataCriacao) }}]</span>
          <span class="ml-2 text-green-300">{{ log.acao }}:</span>
          <span class="ml-1">{{ log.descricao || (log.entidade + (log.entidadeId ? (' #' + log.entidadeId) : ''))
          }}</span>
        </p>
        <p v-if="!logs.length" class="text-slate-300">Nenhum log recente encontrado.</p>
      </template>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos de Admin</h3>
    <div class="grid grid-cols-2 gap-4">
      <button @click="props.openIniciarFluxo?.()"
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center">
        <span class="mb-2">🔄</span>
        <span class="text-sm font-semibold">Iniciar Fluxo</span>
      </button>
      <button @click="props.openCadastroUsuario?.()"
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">👤</span><span class="text-sm font-semibold">Criar Usuário</span></button>
      <button @click="openManageProfiles"
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">👥</span><span class="text-sm font-semibold">Gerenciar Perfis</span></button>
      <button @click="openAuditoria"
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">�</span><span class="text-sm font-semibold">Acessar Logs</span></button>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../lib/http'

const props = defineProps<{
  openCadastroUsuario?: () => void
  openIniciarFluxo?: () => void
}>()

const router = useRouter()
const logs = ref<any[]>([])
const loading = ref(false)

const instance = getCurrentInstance()
const $notify = instance?.appContext.config.globalProperties.$notify

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

async function fetchRecentLogs() {
  loading.value = true
  try {
    // buscar os 4 logs mais recentes
    const res = await http('/api/auditorias?limit=4&page=1')
    // API retorna { registros: [], total } em Auditoria.vue; aceitar ambos
    if (Array.isArray(res)) {
      logs.value = res
    } else if (res && Array.isArray(res.registros)) {
      logs.value = res.registros
    } else {
      logs.value = []
    }
  } catch (err: any) {
    console.error('Erro ao buscar auditoria:', err)
    $notify?.error?.(err?.message || 'Falha ao carregar logs')
    logs.value = []
  } finally {
    loading.value = false
  }
}

function openManageProfiles() {
  // navegar para a página de perfil/gestão de perfis
  // Alterado: redirecionar para a gestão de usuários em vez da página de perfil
  router.push('/usuarios').catch(() => { })
}

function openAuditoria() {
  router.push('/Auditoria').catch(() => { })
}

onMounted(() => {
  fetchRecentLogs()
})
</script>

<style scoped></style>
