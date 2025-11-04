<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Minhas Propostas Comerciais</h3>
    <div class="space-y-4">
      <div
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">Proposta #PC-018 (FutureTech)</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Status: <span
              class="font-medium text-yellow-600 dark:text-yellow-400">Aguardando Validação
              (CFO)</span></p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md">Ver</button></div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-green-700 dark:text-green-300 w-full">Nova
        Proposta</button>
      <button
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-green-700 dark:text-green-300 w-full">Ver
        Contratos</button>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none actions-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Relatórios</h3>
    <p class="text-sm text-gray-500 dark:text-gray-300">Acompanhe performance e conversões comerciais.</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
