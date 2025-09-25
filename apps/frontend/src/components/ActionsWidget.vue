<template>
  <div class="latest-actions">
    <h3>Últimas Ações</h3>
    <ul>
      <li>
        <span class="icon">🕒</span>
        <span class="text"><strong>Proposta XPTO</strong> aprovada por João às
          14:00h</span>
      </li>
      <li>
        <span class="icon">🕒</span>
        <span class="text"><strong>Proposta ZPF9</strong> reprovada por Pedro às
          13:30h</span>
      </li>
    </ul>
    <div class="history-audit">Histórico e Auditoria</div>
  </div>
</template>

<style scoped>
.latest-actions {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.latest-actions h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  /* mesma fonte/tamanho */
  font-weight: 600;
  color: #333;
  /* cor preta/cinza escuro */
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.icon {
  margin-right: 0.5rem;
  color: #16c3af;
  font-size: 1rem;
}

.text {
  font-size: 0.95rem;
  color: #333;
}

.history-audit {
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0E9A97;
  cursor: pointer;
  user-select: none;
}
</style>