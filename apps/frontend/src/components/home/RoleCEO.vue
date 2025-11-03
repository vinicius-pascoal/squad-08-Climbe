<template>
  <div class="widget p-6 stats-widget">
    <!-- KPIs compactos -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      <div class="p-4 bg-white rounded-lg flex items-center gap-3 shadow-sm">
        <div class="p-3 bg-blue-100 rounded-lg"><i data-lucide="building-2" class="text-blue-600"></i></div>
        <div>
          <p class="text-2xl font-bold">28</p>
          <p class="text-sm text-gray-500">Empresas</p>
        </div>
      </div>
      <div class="p-4 bg-white rounded-lg flex items-center gap-3 shadow-sm">
        <div class="p-3 bg-sky-100 rounded-lg"><i data-lucide="users" class="text-sky-600"></i></div>
        <div>
          <p class="text-2xl font-bold">16</p>
          <p class="text-sm text-gray-500">Usuários</p>
        </div>
      </div>
      <div class="p-4 bg-white rounded-lg flex items-center gap-3 shadow-sm">
        <div class="p-3 bg-amber-100 rounded-lg"><i data-lucide="presentation" class="text-amber-600"></i></div>
        <div>
          <p class="text-2xl font-bold">12</p>
          <p class="text-sm text-gray-500">Propostas</p>
        </div>
      </div>
      <div class="p-4 bg-white rounded-lg flex items-center gap-3 shadow-sm">
        <div class="p-3 bg-rose-100 rounded-lg"><i data-lucide="file-check" class="text-rose-600"></i></div>
        <div>
          <p class="text-2xl font-bold">3</p>
          <p class="text-sm text-gray-500">Aprovações</p>
        </div>
      </div>
    </div>
  </div>

  <div class="widget p-6 history-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Aprovações Pendentes</h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <p class="font-medium">Validar Proposta Comercial #PC-015</p>
          <p class="text-sm text-gray-500">CSO: João Silva</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">Aprovar</button><button
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md">Reprovar</button></div>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <p class="font-medium">Aprovar novo usuário: Maria Oliveira</p>
          <p class="text-sm text-gray-500">Cargo: Analista de BPO</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md">Aprovar</button><button
            class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md">Reprovar</button></div>
      </div>
    </div>
  </div>

  <div class="widget p-6 actions-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Relatórios em Destaque</h3>
    <div class="space-y-3">
      <a href="#" class="flex items-center gap-2 text-blue-700 hover:underline"><i data-lucide="pie-chart"></i>
        Relatório Financeiro Q3</a>
      <a href="#" class="flex items-center gap-2 text-blue-700 hover:underline"><i data-lucide="trending-up"></i>
        Crescimento de Novos Clientes</a>
      <a href="#" class="flex items-center gap-2 text-blue-700 hover:underline"><i data-lucide="activity"></i>
        Performance de Analistas</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>

<script setup lang="ts"></script>

<style scoped></style>
