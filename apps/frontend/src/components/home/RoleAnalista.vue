<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none w-full h-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Minhas Tarefas</h3>
      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-300 hover:underline">Ver todas</a>
    </div>
    <div class="space-y-4">
      <div
        class="flex items-center gap-4 p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <i data-lucide="file-check-2" class="text-orange-500"></i>
        <div class="flex-1">
          <p class="font-medium">Analisar complexidade do Contrato #2025-A89</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Cliente: Inovatech Soluções | Prazo: 23/10/2025</p>
        </div>
        <span class="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Urgente</span>
      </div>
      <div
        class="flex items-center gap-4 p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <i data-lucide="file-clock" class="text-blue-500"></i>
        <div class="flex-1">
          <p class="font-medium">Pedir revisão do Contrato #2025-B12</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Cliente: TechCorp | Prazo: 25/10/2025</p>
        </div>
      </div>
      <div
        class="flex items-center gap-4 p-3 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg w-full">
        <i data-lucide="bar-chart-3" class="text-green-500"></i>
        <div class="flex-1">
          <p class="font-medium">Criar relatório de performance Q3</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">Projeto: Análise de Mercado | Prazo: 28/10/2025</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos Rápidos</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-blue-700 dark:text-blue-300 transition-colors w-full text-center"><i
          data-lucide="files" class="mb-2"></i><span class="text-sm font-semibold">Ver Contratos</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-blue-700 dark:text-blue-300 transition-colors w-full text-center"><i
          data-lucide="calendar-plus" class="mb-2"></i><span class="text-sm font-semibold">Agendar
          Reunião</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-blue-700 dark:text-blue-300 transition-colors w-full text-center"><i
          data-lucide="upload-cloud" class="mb-2"></i><span class="text-sm font-semibold">Upload de
          Arquivo</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-blue-700 dark:text-blue-300 transition-colors w-full text-center"><i
          data-lucide="file-plus-2" class="mb-2"></i><span class="text-sm font-semibold">Criar Relatório</span></button>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Criar Relatório</h3>
    <p class="text-sm text-gray-500 dark:text-gray-300">Acesse os dados e gere análises detalhadas para o período
      selecionado.</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
