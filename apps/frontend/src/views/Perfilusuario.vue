<template>
  <div class="h-screen absolute top-5">
    <h1 class="font-bold text-[40px]">Perfil do usuário</h1>
  </div>

  <div class="flex justify-between items-center h-fit">
    <div class="flex items-start gap-4">
      <p class="text-brand-0e9a97">Gestão de usuários</p>
      <p class="text-brand-0e9a97">></p>
      <p class="text-brand-5f6060">Perfil de usuário</p>
    </div>
    <div class="flex justify-between items-center">
      <button
        class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-f9cdca border border-brand-bf1f2b text-brand-bf1f2b text-[18px] rounded-lg w-[173px] h-[40px] cursor-pointer mr-4">Redefinir
        senha</button>
      <button
        class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-f9cdca border border-brand-bf1f2b text-brand-bf1f2b text-[18px] rounded-lg w-[173px] h-[40px] cursor-pointer">Desativar
        usuario</button>
    </div>
  </div>

  <div class="flex justify-end mt-10 w-full">
    <div class="flex flex-col w-[35%] mr-8">
      <div class="history-card rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white w-fit h-fit">
        <h2 class="history-title">Histórico de ações</h2>
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acao in acoes" :key="acao.id">
              <td>{{ acao.data_hora }}</td>
              <td>{{ acao.açao }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

   <div class="flex flex-col gap-8 w-fit ml-auto">
  <div
    class="flex flex-col items-center gap-4 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white w-[276px] h-[298px] p-6">
    <img src="/img/usuario.svg" alt="Avatar" class="w-24 h-24 rounded-full" />
    <h1 class="text-xl font-bold">Luiz Gomes</h1>
    <p class="text-sm text-gray-500">luiz.gomes@gmail.com.br</p>
    <input value="Gerente"
      class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-f3eeee text-lg rounded-lg w-[173px] h-[40px] px-8 text-center"
      readonly>
  </div>

  <div class="flex flex-col gap-2 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] w-[304px] h-fit p-6 bg-white">
    <h1 class="text-xl font-bold">Permissões</h1>
    <div class="flex flex-col w-full border overflow-hidden shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <p class="p-3 bg-white border border-gray-300 text-brand-5f6060 h-fit">Aprovar cadastros de usuários</p>
      <p class="p-3 bg-white border border-gray-300 text-brand-5f6060">Acessar auditoria de contratos</p>
      <p class="p-3 bg-white border border-gray-300 text-brand-5f6060">Criar e aprovar propostas</p>
    </div>
    <div class="flex justify-between w-full gap-4">
      <button
        class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-f9cdca border border-brand-bf1f2b text-brand-bf1f2b text-[18px] rounded-lg w-[132px] h-[32px] cursor-pointer">
        Excluir
      </button>
      <button
        class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-cad7ff border border-brand-2c57bb text-brand-3964c6 text-[18px] rounded-lg w-[132px] h-[32px] cursor-pointer">
        Adicionar
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script>
export default {
  name: 'HistoricoAcoes',
  data() {
    return {
      acoes: [
        { id: 1, data_hora: '20/08/2025 - 14:32', açao: 'Criou contrato com a empresa Tech Solutions Ltda' },
        { id: 2, data_hora: '18/08/2025 - 09:15', açao: 'Aprovou proposta da Construtora Alpha' },
        { id: 3, data_hora: '16/08/2025 - 16:42', açao: 'Editou cadastro da empresa Beta Corp' },
        { id: 4, data_hora: '01/08/2025 - 11:30', açao: 'Criou o cadastro da empresa Tech Solutions Ltda' }
      ]
    };
  }
};
</script>

<style scoped>
.history-card {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.history-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

table {
  width: 583px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  color: #3E4343;
}

tbody tr:last-child td {
  border-bottom: none;
}
</style>