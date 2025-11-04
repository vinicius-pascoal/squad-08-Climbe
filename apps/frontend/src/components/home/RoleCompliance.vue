<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Contratos Pendentes de Revisão</h3>
    <div class="space-y-4">
      <div
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium">Revisar Contrato #2025-B12</p>
          <p class="text-sm text-gray-500">Solicitado por: Analista Silva</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md">Abrir</button></div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos de Compliance</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-red-700 dark:text-red-300 w-full hover:bg-red-100 dark:hover:bg-red-600">Novo
        Contrato</button>
      <button
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-red-700 dark:text-red-300 w-full hover:bg-red-100 dark:hover:bg-red-600">Revisar
        Docs</button>
      <button
        class="p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-red-700 dark:text-red-300 w-full hover:bg-red-100 dark:hover:bg-red-600">Aprovar
        Usuário</button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
