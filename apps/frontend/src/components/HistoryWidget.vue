<template>
  <div class="meeting-history">
    <div class="header">
      <h3>Histórico de Reuniões</h3>
      <input type="search" placeholder="Filtrar por..." class="search-input" />
    </div>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Empresa</th>
          <th>Tipo</th>
          <th>Participantes</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>18/08</td>
          <td>XXXX</td>
          <td>Online</td>
          <td>3</td>
          <td><span class="status realizada">Realizada</span></td>
        </tr>
        <tr>
          <td>10/08</td>
          <td>HOKP</td>
          <td>Online</td>
          <td>2</td>
          <td><span class="status cancelada">Cancelada</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.meeting-history {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.meeting-history h3 {
  margin: 0;
  font-size: 1rem;
  /* mesmo tamanho da fonte dos títulos */
  font-weight: 600;
  color: #333;
  /* cor preta/cinza escuro */
}

.search-input {
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 150px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead th {
  text-align: left;
  padding-bottom: 0.5rem;
  color: #666;
}

tbody td {
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
}

.status {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.realizada {
  background-color: #16c3af33;
  color: #16c3af;
}

.status.cancelada {
  background-color: #fddede;
  color: #d32f2f;
}
</style>