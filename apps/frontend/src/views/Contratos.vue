<template>
  <div class="gap-x-4 ">
    <input type="search" placeholder="pesquisar"
      class="pesquisar shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-brand-e1e5e5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-[624px] mt-4 mb-6 placeholder-black dark:placeholder-gray-300" />
    <input type="button" value="Criar contratos"
      class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border border-brand-3b67d0 dark:border-cyan-700 bg-brand-cad8fd dark:bg-cyan-900 text-brand-2551b2 dark:text-cyan-200 rounded-lg px-4 py-2 hover:cursor-pointer"
      @click="toggleModal" />
  </div>

  <div class="flex gap-x-4 w-full mb-6">
  </div>
  <div class="flex gap-x-4 w-full">
    <input type="button" value="Empresa"
      class="seta shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-brand-e1e5e5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-[184px] h-[39px] mt-4 mb-6 text-brand-5f6060 dark:text-gray-200" />
    <input type="button" value="Todos os status"
      class="seta shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-brand-e1e5e5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-[184px] h-[39px] mt-4 mb-6 text-brand-5f6060 dark:text-gray-200" />
    <input type="button" value="Vencimento"
      class="seta shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-brand-e1e5e5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-[184px] h-[39px] mt-4 mb-6 text-brand-5f6060 dark:text-gray-200" />
    <div class="w-full grid justify-items-end">
      <input type="button" value="Exportar"
        class="exportar shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-brand-e1e5e5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-[184px] h-[39px] mt-4 mb-6 text-brand-5f6060 dark:text-gray-200 justify-items-end" />
    </div>
  </div>
  <div class="h-fit w-9/10 p-6 rounded-lg bg-white dark:bg-gray-900 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
    <table class="w-full border-separate border-spacing-y-2 bg-white dark:bg-gray-900">
      <thead>
        <tr
          class="text-bold bg-white dark:bg-gray-800 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
          <th class="p-2 text-center border-r-2 border-brand-5f6060 dark:border-gray-700 dark:text-gray-200">Empresa
          </th>
          <th class="p-2 text-center border-r-2 border-brand-5f6060 dark:border-gray-700 dark:text-gray-200">Vinculado a
            proposta</th>
          <th class="p-2 text-center border-r-2 border-brand-5f6060 dark:border-gray-700 dark:text-gray-200">Validade
          </th>
          <th class="p-2 text-center border-r-2 border-brand-5f6060 dark:border-gray-700 dark:text-gray-200">Status</th>
          <th class="p-2 text-center dark:text-gray-200">Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contract in contracts" :key="contract.id"
          class="bg-brand-f0f0f0 dark:bg-gray-800 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-50 dark:hover:bg-gray-700">
          <Contratocard :icon="contract.icon" :company="contract.company" :proposal="contract.proposal"
            :validity="contract.validity" :status="contract.status" />
        </tr>
      </tbody>

    </table>
  </div>
  <PopupCreatContract v-if="showModal" @close="toggleModal" />
</template>
<script setup>
import { ref } from 'vue';
import Contratocard from '../components/Contratocard.vue';
import PopupCreatContract from '../components/PopupCreatContract.vue';
const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const contracts = ref([
  {
    id: 1,
    company: 'Pingu tecnologia',
    proposal: '#00016',
    validity: '01/10/2025',
    status: 'Aprovado', // This will render the 'Aprovado' span
    icon: '/icones/pingu.svg',
  },
  {
    id: 2,
    company: 'TED talks',
    proposal: '#00017',
    validity: '15/11/2025',
    status: 'Rescindido',
    icon: '/icones/tedlogo.svg', // This will render the 'Em revisão' span
  },
  {
    id: 3,
    company: 'Construtora PWA',
    proposal: '#00018',
    validity: '20/12/2025',
    status: 'Em revisão',
    icon: '/icones/pwalogo.svg', // This will render the 'Rescindido' span
  },
]);
</script>
<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pesquisar {
  background-image: url('/icones/pesquisa.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.exportar {
  background-image: url('/icones/exportar.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.aprovado {
  background-image: url('/icones/contratoaprovado.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.revisao {
  background-image: url('/icones/contratorevisao.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.rescindido {
  background-image: url('/icones/contratorescindido.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.seta {
  background-image: url('/icones/setinha.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}
</style>
