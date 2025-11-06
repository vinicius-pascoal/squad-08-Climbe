<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <!-- KPIs compactos -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-blue-100 rounded-lg"><i data-lucide="building-2" class="text-blue-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">28</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Empresas</p>
        </div>
      </div>
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-sky-100 rounded-lg"><i data-lucide="users" class="text-sky-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">16</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Usuários</p>
        </div>
      </div>
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-amber-100 rounded-lg"><i data-lucide="presentation" class="text-amber-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Propostas</p>
        </div>
      </div>
      <div
        class="p-4 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-3 shadow-sm dark:shadow-transparent w-full">
        <div class="p-3 bg-rose-100 rounded-lg"><i data-lucide="file-check" class="text-rose-600"></i></div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">3</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Aprovações</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Aprovações Pendentes</h3>
    <div class="space-y-4">
      <div
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">Validar Proposta Comercial #PC-015</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">CSO: João Silva</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">Aprovar</button><button
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md">Reprovar</button></div>
      </div>
      <div
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">Aprovar novo usuário: Maria Oliveira</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Cargo: Analista de BPO</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">Aprovar</button><button
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md">Reprovar</button></div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none actions-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Ações Rápidas</h3>
    <div class="space-y-3">
      <button @click="props.openIniciarFluxo?.()"
        class="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-sidebar to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
        <span class="text-xl">🔄</span>
        <span class="font-semibold">Iniciar Fluxo de Contrato</span>
      </button>
      <a href="#" class="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline"><i
          data-lucide="pie-chart"></i>
        Relatório Financeiro Q3</a>
      <a href="#" class="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline"><i
          data-lucide="trending-up"></i>
        Crescimento de Novos Clientes</a>
      <a href="#" class="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline"><i
          data-lucide="activity"></i>
        Performance de Analistas</a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  openIniciarFluxo?: () => void
}>()
</script>

<style scoped></style>
