<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Propostas para Validação Financeira</h3>
    <div class="space-y-4">
      <div
        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-gray-100">Validar Proposta Comercial #PC-018</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Cliente: FutureTech | Criado por: CSO</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">Validar</button></div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Gerenciar Alocação de Analistas</h3>
    <div class="space-y-4">
      <div
        class="flex items-end gap-4 p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Anexar Analista ao Contrato</label>
          <select
            class="mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2">
            <option>Contrato #2025-C40 (Quantum)</option>
          </select>
        </div>
        <button class="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md">Anexar</button>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none actions-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Relatórios Financeiros</h3>
    <div class="space-y-3">
      <a href="#" class="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline">Criar Novo
        Relatório</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
