<template>
  <div class="modal-overlay">
    <div class="modal-content max-w-4xl">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Contrato</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Visualize e gerencie o contrato</p>
        </div>
        <button @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <!-- Informações do Contrato -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-600 dark:text-gray-300">ID do Contrato</label>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ contract.id }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-600 dark:text-gray-300">Empresa</label>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ contract.company }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-600 dark:text-gray-300">Proposta Vinculada</label>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ contract.proposal }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-600 dark:text-gray-300">Validade</label>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ contract.validity }}</p>
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-semibold text-gray-600 dark:text-gray-300">Status Atual</label>
            <div class="flex items-center gap-2">
              <span v-if="contract.status === 'Aprovado'"
                class="px-4 py-2 inline-flex text-sm font-semibold rounded-full bg-green-100 border border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Aprovado
              </span>
              <span v-else-if="contract.status === 'Em revisão'"
                class="px-4 py-2 inline-flex text-sm font-semibold rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Em Revisão
              </span>
              <span v-else-if="contract.status === 'Rescindido'"
                class="px-4 py-2 inline-flex text-sm font-semibold rounded-full bg-red-100 border border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Rescindido
              </span>
              <span v-else
                class="px-4 py-2 inline-flex text-sm font-semibold rounded-full bg-gray-100 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                {{ contract.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 dark:border-gray-700"></div>

        <!-- Ações -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ações do Contrato</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Botão Aprovar -->
            <button @click="handleApprove" :disabled="contract.status === 'Aprovado' || loading"
              class="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ loading ? 'Processando...' : 'Aprovar Contrato' }}
            </button>

            <!-- Botão Recusar -->
            <button @click="handleReject" :disabled="contract.status === 'Rescindido' || loading"
              class="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {{ loading ? 'Processando...' : 'Recusar Contrato' }}
            </button>
          </div>
        </div>

        <!-- Botão Fechar -->
        <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="$emit('close')"
            class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  contract: {
    id: string;
    company: string;
    proposal: string;
    validity: string;
    status: string;
  };
}>();

const emit = defineEmits(['close', 'approve', 'reject']);

const loading = ref(false);

const handleApprove = async () => {
  const Swal = (await import('sweetalert2')).default;

  const result = await Swal.fire({
    title: 'Aprovar Contrato?',
    text: `Tem certeza que deseja aprovar o contrato ${props.contract.id}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, Aprovar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6c757d',
    customClass: {
      container: 'swal-high-z'
    }
  }); if (result.isConfirmed) {
    loading.value = true;
    try {
      emit('approve', props.contract.id);
    } finally {
      loading.value = false;
    }
  }
};

const handleReject = async () => {
  const Swal = (await import('sweetalert2')).default;

  const result = await Swal.fire({
    title: 'Recusar Contrato?',
    text: `Tem certeza que deseja recusar o contrato ${props.contract.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, Recusar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6c757d',
    customClass: {
      container: 'swal-high-z'
    }
  }); if (result.isConfirmed) {
    loading.value = true;
    try {
      emit('reject', props.contract.id);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.dark .modal-content {
  background: rgb(31, 41, 55);
}

/* Custom scrollbar */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark .modal-content::-webkit-scrollbar-track {
  background: #374151;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* SweetAlert z-index override */
:deep(.swal-high-z) {
  z-index: 10100 !important;
}
</style>
