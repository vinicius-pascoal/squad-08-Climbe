<template>
  <div class="statistics">
    <div class="card">
      <span class="title">Empresas Cadastradas</span>
      <span class="value">28</span>
    </div>
    <div class="card">
      <span class="title">Usuários Ativos</span>
      <span class="value">16</span>
    </div>
    <div class="card">
      <span class="title">Propostas</span>
      <span class="value">42</span>
    </div>
  </div>
</template>

<style scoped>
.statistics {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card {
  background-color: white;
  border-radius: 12px;
  flex: 1;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  color: #333;
  /* cor preta/cinza escuro */
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1.75rem;
  font-weight: bold;
  color: #0A0A0A;
}
</style>