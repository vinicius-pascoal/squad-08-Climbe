<script>
import Card from '../components/card.vue';
export default {
  components: {
    Card
  }
}
</script>
<template>
  <div class="gestaousuario ml-16 relative ">
    <h1 class="font-bold text-[40px]">Gestão de Usuário</h1>
    <div class="absolute top-0 right-0 mt-4 mr-16 flex space-x-4">
      <a>
        <img src="/icones/carinhafeliz.svg" alt="">
      </a>
      <a>
        <img src="/icones/interrogacao.svg" alt=""></img>
      </a>
      <a>
        <img src="/icones/humano.svg" alt="">
      </a>

    </div>
    <a class="absolute top-0 right-0  ">
      <img src="/icones/usuario.svg" alt=""></img>
    </a>
    <input type="search" placeholder="pesquisar por nome/email"
      class="email shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-[#E1E5E5] rounded-lg px-4 py-2 w-[80vh] mt-4 mb-6 text-[#5F6060]" />
    <input type="button" value="Filtros"
      class=" filtro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#E1E5E5] text-[#5F6060] rounded-lg px-4 py-2 mb-6 hover cursor-pointer ml-4" />
    <input type="button" value="Cadastrar usuário"
      class=" cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#CAD8FD] border border-[#3B67D0] text-white rounded-lg px-4 py-2 mb-6 hover cursor-pointer ml-16" />
    <div>
    </div>
    <div class="p-4 bg-white rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">


      <table class=" bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-white">
          <tr class="grid grid-cols-6 h-[50px] items-center">
            <th
              class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-[#5F6060] border-r-2 h-[40px]">
              Nome Completo</th>
            <th
              class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-[#5F6060] border-r-2 h-[40px]">
              Cargo</th>
            <th
              class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold col-span-2 border-[#5F6060] border-r-2 h-[40px]">
              Email</th>
            <th
              class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-[#5F6060] border-r-2 h-[40px]">
              Permissões</th>
            <th
              class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-r-2 h-[40px]">
              Status</th>
          </tr>
        </thead>
        <tbody class="max-h-[60vh] overflow-y-auto h-[50vh] w-fit flex flex-col gap-4 my-4">
          <Card name="Fabio Lima" email="fabiolima@outlook.com" cargo="gerente" permisao='admin' status="ativo" />
          <Card name="Geovana Carvalho" email="geocarvalho@hotmail.com" cargo="analista"
            permisao="cria e envia propostas" status="inativo" />
          <Card name="Mateus Silva" email="mateussilva@gmail.com" cargo="diretor" permisao="aprova contrato"
            status="pendente" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
          <Card name="Daniel Marques" email="danielmarqes@hotmail.com" cargo="financeiro"
            permisao="acessa dados financeiros" status="ativo" />
        </tbody>
      </table>
    </div>
  </div>

</template>
<style scoped>
.email {
  background-image: url('/icones/pesquisa.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.filtro {
  background-image: url('/icones/filtro.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 70px;
}

.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 5px center;
  padding-left: 40px;
}
</style>
