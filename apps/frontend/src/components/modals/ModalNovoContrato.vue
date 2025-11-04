<template>
  <div class="modal-overlay">
    <div class="modal-content max-w-3xl">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Novo Contrato</h2>
          <p class="text-sm text-slate-500">Preencha os dados abaixo para criar um novo contrato</p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form @submit.prevent="handleSubmit">
          <p class="font-bold text-lg mb-6 dark:text-gray-200">Informações do Contrato</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código do Contrato <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="formData.id" required placeholder="Ex: CTR-2025-001"
                class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
            </div>

            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Contrato <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="formData.nome" required placeholder="Ex: Contrato de Prestação de Serviços"
                class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
            </div>

            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor do Contrato <span
                  class="text-red-500">*</span></label>
              <input type="number" v-model.number="formData.valor" required step="0.01" min="0" placeholder="0.00"
                class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
            </div>

            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID da Proposta</label>
              <input type="number" v-model.number="formData.propostaId" placeholder="Ex: 12345"
                class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
            </div>

            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Início <span
                  class="text-red-500">*</span></label>
              <input type="date" v-model="formData.dataInicio" required
                class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
            </div>

            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Vencimento <span
                  class="text-red-500">*</span></label>
              <input type="date" v-model="formData.dataFim" required
                class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
            <p class="font-semibold text-sm mb-4 dark:text-gray-200">Informações Adicionais (Opcional)</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select v-model="formData.status"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200">
                  <option value="">Selecione...</option>
                  <option value="Rascunho">Rascunho</option>
                  <option value="Em revisão">Em revisão</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Rescindido">Rescindido</option>
                </select>
              </div>

              <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Partes Envolvidas</label>
                <input type="text" v-model="formData.envolvidos" placeholder="Ex: Empresa A, Empresa B"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200" />
              </div>

              <div class="flex flex-col md:col-span-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                <textarea v-model="formData.descricao" rows="3" placeholder="Descreva os detalhes do contrato..."
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-gray-200"></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="onCancel"
              class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="loading"
              class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="loading">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
              {{ loading ? 'Criando...' : 'Criar Contrato' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { createcontrato } from '../../services/contract';
import Swal from 'sweetalert2';
const emit = defineEmits(['close']);

const formData = ref({
  id: '',
  nome: '',
  propostaId: 0,
  status: 'Rascunho',
  descricao: '',
  valor: 0,
  dataInicio: '',
  dataFim: '',
  envolvidos: '',
  acoes: '',
  permissoes: '',
});

const loading = ref(false);

const convertToISO = (dateString: string) => {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  return date.toISOString();
};

const onCancel = () => { emit('close'); };

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (!formData.value.id || !formData.value.nome || formData.value.valor <= 0 || !formData.value.dataInicio || !formData.value.dataFim) {
      await Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha todos os campos obrigatórios e informe um valor maior que zero' });
      loading.value = false;
      return;
    }

    const dataInicio = new Date(formData.value.dataInicio);
    const dataFim = new Date(formData.value.dataFim);
    if (dataFim < dataInicio) {
      await Swal.fire({ icon: 'warning', title: 'Atenção', text: 'A data de vencimento deve ser posterior à data de início' });
      loading.value = false;
      return;
    }

    const payload: any = {
      id: formData.value.id.trim(),
      nome: formData.value.nome.trim(),
      valor: Number(formData.value.valor),
      dataInicio: convertToISO(formData.value.dataInicio),
      dataFim: convertToISO(formData.value.dataFim),
    };

    if (formData.value.propostaId && formData.value.propostaId > 0) payload.propostaId = formData.value.propostaId;
    if (formData.value.status && formData.value.status.trim()) payload.status = formData.value.status.trim();
    if (formData.value.envolvidos && formData.value.envolvidos.trim()) payload.envolvidos = formData.value.envolvidos.trim();
    if (formData.value.descricao && formData.value.descricao.trim()) payload.descricao = formData.value.descricao.trim();

    await createcontrato(payload);

    await Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Contrato criado com sucesso!', confirmButtonText: 'OK' });

    emit('close');
  } catch (error: any) {
    console.error('Erro ao criar contrato:', error);
    await Swal.fire({ icon: 'error', title: 'Erro', text: error?.message || 'Erro ao criar contrato. Tente novamente.' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 95%;
  max-width: 900px
}
</style>
