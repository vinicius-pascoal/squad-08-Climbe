<template>
  <div class="widget p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800">Minhas Tarefas</h3>
      <a href="#" class="text-sm font-medium text-blue-600 hover:underline">Ver todas</a>
    </div>
    <div class="space-y-4">
      <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <i data-lucide="file-check-2" class="text-orange-500"></i>
        <div class="flex-1">
          <p class="font-medium">Analisar complexidade do Contrato #2025-A89</p>
          <p class="text-sm text-gray-500">Cliente: Inovatech Soluções | Prazo: 23/10/2025</p>
        </div>
        <span class="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Urgente</span>
      </div>
      <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <i data-lucide="file-clock" class="text-blue-500"></i>
        <div class="flex-1">
          <p class="font-medium">Pedir revisão do Contrato #2025-B12</p>
          <p class="text-sm text-gray-500">Cliente: TechCorp | Prazo: 25/10/2025</p>
        </div>
      </div>
      <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <i data-lucide="bar-chart-3" class="text-green-500"></i>
        <div class="flex-1">
          <p class="font-medium">Criar relatório de performance Q3</p>
          <p class="text-sm text-gray-500">Projeto: Análise de Mercado | Prazo: 28/10/2025</p>
        </div>
      </div>
    </div>
  </div>

  <div class="widget p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Atalhos Rápidos</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        class="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"><i
          data-lucide="files" class="mb-2"></i><span class="text-sm font-semibold text-center">Ver
          Contratos</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"><i
          data-lucide="calendar-plus" class="mb-2"></i><span class="text-sm font-semibold text-center">Agendar
          Reunião</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"><i
          data-lucide="upload-cloud" class="mb-2"></i><span class="text-sm font-semibold text-center">Upload de
          Arquivo</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"><i
          data-lucide="file-plus-2" class="mb-2"></i><span class="text-sm font-semibold text-center">Criar
          Relatório</span></button>
    </div>
  </div>

  <div class="widget p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Criar Relatório</h3>
    <p class="text-sm text-gray-500">Acesse os dados e gere análises detalhadas para o período selecionado.</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
