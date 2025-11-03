<template>
  <div class="widget p-6 stats-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Propostas para Validação Financeira</h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <p class="font-medium">Validar Proposta Comercial #PC-018</p>
          <p class="text-sm text-gray-500">Cliente: FutureTech | Criado por: CSO</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">Validar</button></div>
      </div>
    </div>
  </div>

  <div class="widget p-6 history-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Gerenciar Alocação de Analistas</h3>
    <div class="space-y-4">
      <div class="flex items-end gap-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700">Anexar Analista ao Contrato</label>
          <select class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
            <option>Contrato #2025-C40 (Quantum)</option>
          </select>
        </div>
        <button class="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md">Anexar</button>
      </div>
    </div>
  </div>

  <div class="widget p-6 actions-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Relatórios Financeiros</h3>
    <div class="space-y-3">
      <a href="#" class="flex items-center gap-2 text-blue-700 hover:underline">Criar Novo Relatório</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
