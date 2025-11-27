<template>
  <div class="flex items-center gap-4 mb-6">
    <input type="search" placeholder="pesquisar" v-model="searchTerm"
      class="pesquisar shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-brand-e1e5e5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-[624px] placeholder-black dark:placeholder-gray-300" />
    <input type="button" value="Criar contratos"
      class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-cad8fd border border-brand-3b67d0 text-brand-3b67d0 font-bold rounded-lg px-4 py-2 hover:bg-brand-93c5fd cursor-pointer ml-16 transition dark:bg-brand-cad8fd dark:border-brand-3b67d0 dark:text-brand-3b67d0 dark:hover:bg-brand-93c5fd"
      @click="toggleModal" />
  </div>

  <div class="flex gap-4 mb-6">
    <div class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 dark:filter-pill">
      <span class="text-slate-600 text-sm dark:text-white">Status</span>
      <span class="text-slate-400 dark:text-white">▾</span>
      <select class="pill-select" v-model="selectedStatus">
        <option value="">Todos</option>
        <option value="Aprovado">Aprovado</option>
        <option value="Em revisão">Em revisão</option>
        <option value="Rescindido">Rescindido</option>
      </select>
    </div>

    <div class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 dark:filter-pill">
      <span class="text-slate-600 text-sm dark:text-white">Vencimento</span>
      <span class="text-slate-400 dark:text-white">▾</span>
      <input type="date" class="pill-input" v-model="dataVencimento">
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
        <tr v-if="loading">
          <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Carregando contratos...
          </td>
        </tr>
        <tr v-else-if="filteredContracts.length === 0">
          <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Nenhum contrato encontrado
          </td>
        </tr>
        <tr v-else v-for="contract in filteredContracts" :key="contract.id"
          class="bg-brand-f0f0f0 dark:bg-gray-800 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-50 dark:hover:bg-gray-700">
          <Contratocard :icon="contract.icon" :company="contract.company" :proposal="contract.proposal"
            :validity="contract.validity" :status="contract.status" @open-contract="openContract(contract)" />
        </tr>
      </tbody>

    </table>
  </div>
  <PopupCreatContract v-if="showModal" @close="toggleModal" @open-new="openNovoContrato" />
  <ModalNovoContrato v-if="showNewContractModal" @close="() => (showNewContractModal = false)" />
  <ModalViewContrato v-if="showViewContractModal && selectedContract" :contract="selectedContract"
    @close="closeViewContract" @approve="handleApprove" @reject="handleReject" />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Contratocard from '../components/Contratocard.vue';
import PopupCreatContract from '../components/PopupCreatContract.vue';
import ModalNovoContrato from '../components/modals/ModalNovoContrato.vue';
import ModalViewContrato from '../components/modals/ModalViewContrato.vue';
import { listContratos, aprovarContrato, recusarContrato, type ContratoResponse } from '../services/contract';
import { listEmpresas, type EmpresaResponse } from '../services/empresa';
import { getCurrentInstance } from 'vue';

const showModal = ref(false);
const showNewContractModal = ref(false);
const showViewContractModal = ref(false);
const selectedContract = ref<any>(null);
const contracts = ref<any[]>([]);
const empresas = ref<EmpresaResponse[]>([]);
const loading = ref(false);

// Variáveis reativas para os filtros
const searchTerm = ref('');
const selectedStatus = ref('');
const dataVencimento = ref('');

const toggleModal = () => {
  showModal.value = !showModal.value;
  // Recarrega a lista quando o modal é fechado
  if (!showModal.value) {
    loadContratos();
  }
};

function openNovoContrato() {
  // close the creator options popup and open the full contract modal
  showModal.value = false;
  showNewContractModal.value = true;
}

const openContract = (contract: any) => {
  selectedContract.value = contract;
  showViewContractModal.value = true;
};

const closeViewContract = () => {
  showViewContractModal.value = false;
  selectedContract.value = null;
};

const handleApprove = async (contractId: string) => {
  const Swal = (await import('sweetalert2')).default;

  try {
    await aprovarContrato(contractId);

    await Swal.fire({
      icon: 'success',
      title: 'Contrato Aprovado!',
      text: `O contrato ${contractId} foi aprovado com sucesso.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Atualiza o status localmente
    const index = contracts.value.findIndex(c => c.id === contractId);
    if (index !== -1) {
      contracts.value[index].status = 'Aprovado';
    }

    closeViewContract();
    loadContratos(); // Recarrega a lista
  } catch (error: any) {
    console.error('Erro ao aprovar contrato:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: error?.message || 'Erro ao aprovar contrato. Tente novamente.',
    });
  }
};

const handleReject = async (contractId: string) => {
  const Swal = (await import('sweetalert2')).default;

  try {
    await recusarContrato(contractId);

    await Swal.fire({
      icon: 'success',
      title: 'Contrato Recusado!',
      text: `O contrato ${contractId} foi recusado.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Atualiza o status localmente
    const index = contracts.value.findIndex(c => c.id === contractId);
    if (index !== -1) {
      contracts.value[index].status = 'Rescindido';
    }

    closeViewContract();
    loadContratos(); // Recarrega a lista
  } catch (error: any) {
    console.error('Erro ao recusar contrato:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: error?.message || 'Erro ao recusar contrato. Tente novamente.',
    });
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

const _ins = getCurrentInstance();
const notify = _ins?.appContext.config.globalProperties.$notify as any;
const loadContratos = async () => {
  loading.value = true;
  try {
    const data = await listContratos();
    contracts.value = data.map((contrato: ContratoResponse) => ({
      id: contrato.id,
      company: contrato.nome,
      proposal: `#${String(contrato.propostaId).padStart(5, '0')}`,
      validity: formatDate(contrato.dataFim),
      validityRaw: contrato.dataFim,
      status: contrato.status,
      icon: '/icones/pingu.svg', // Pode ajustar conforme necessário
    }));
  } catch (error: any) {
    console.error('Erro ao carregar contratos:', error);
    notify?.error(error?.message || 'Erro ao carregar contratos');
  } finally {
    loading.value = false;
  }
};

const loadEmpresas = async () => {
  try {
    empresas.value = await listEmpresas();
  } catch (error: any) {
    console.error('Erro ao carregar empresas:', error);
    notify?.error(error?.message || 'Erro ao carregar empresas');
  }
};

// Computed property para filtrar contratos
const filteredContracts = computed(() => {
  let filtered = [...contracts.value];

  // Filtro de pesquisa por texto
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(contract =>
      contract.company.toLowerCase().includes(term) ||
      contract.proposal.toLowerCase().includes(term) ||
      (contract.status && contract.status.toLowerCase().includes(term))
    );
  }

  // Filtro por status
  if (selectedStatus.value) {
    filtered = filtered.filter(contract =>
      contract.status === selectedStatus.value
    );
  }

  // Filtro por data de vencimento
  if (dataVencimento.value) {
    filtered = filtered.filter(contract => {
      const contractDate = new Date(contract.validityRaw);
      const filterDate = new Date(dataVencimento.value);

      // Comparar apenas a data (ignorar hora)
      contractDate.setHours(0, 0, 0, 0);
      filterDate.setHours(0, 0, 0, 0);

      return contractDate.getTime() === filterDate.getTime();
    });
  }

  return filtered;
});

onMounted(() => {
  loadContratos();
});

// Dados de exemplo (comentados para referência)
/*
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
*/
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

.pill-input,
.pill-select {
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background-color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
}

.pill-input:focus,
.pill-select:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

:deep(.dark) .pill-input,
:deep(.dark) .pill-select {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: #485780 !important;
  color: white !important;
}
</style>
