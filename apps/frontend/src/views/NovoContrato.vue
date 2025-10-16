<template>
  <div>
    <div class="absolute top-0 z-50 bg-gray-100 px-8 py-6">
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-4">
      <h1 class="text-black font-semibold text-lg">Projeto</h1>
      <input type="button" value="The Blonde"
        class="bg-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium" />
      <p class="text-gray-500 text-2xl">></p>
      <h1 class="text-black font-semibold text-lg">Tipo</h1>
      <input type="button" value="#HOP09"
        class="bg-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium" />
    </div>
    <div class="flex items-center gap-4">
      <p class="font-semibold text-gray-800"></p>
      <div class="w-64">
        <ProgressBar :progress="87.53" />
      </div>
    </div>
  </div>
</div>
    
    <div class="flex flex-col p-8 pt-8 h-screen bg-gray-100">
      <div class="flex flex-wrap gap-4 justify-between">
        <WorkflowSteps
          v-for="step in stepsData"
          :key="step.id"
          :step-number="step.id"
          :step-name="step.name"
          :status="step.status"
        />
      </div>

      <div class="flex gap-8 mt-8 flex-1">
        <div class="flex-1 flex flex-col bg-white p-6 rounded-lg shadow-md h-fit">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <h1 class="font-bold text-lg">Etapa 4:</h1>
              <h2 class="text-lg">Assinatura</h2>
            </div>
            <button class="text-brand-17bfbd font-medium">Atualizar</button>
          </div>
          
          <p class="text-gray-600 mb-6 text-sm">Adicione sua assinatura eletrônica ao contrato facilmente. Você pode usar a ferramenta de Assinatura do contract.io ou adicionar manualmente a imagem digitalizada da assinatura.</p>
          
          <SignatureBox />
          
          <div class="flex justify-start my-3">
            <button class="shadow-md bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-800 font-medium">Salvar</button>
          </div>
          
          <div class="mt-8">
            <h2 class="font-bold mb-2">Arquivo</h2>
            <FileDropzone @file-uploaded="handleUploadedFile" />
          </div>
        </div>

        <div class="flex-1 flex flex-col bg-white p-6 rounded-lg shadow-md relative h-fit">
          <h1 class="font-bold text-lg mb-2">Campos do Contrato</h1>
          <p class="text-gray-600 mb-6 text-sm">Você pode alterar os campos do contrato a qualquer momento durante todo o processo.</p>
          
          <p class="font-bold text-sm mb-4">Detalhes do Contrato</p>
          
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Nome do Contrato</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Valor do Contrato</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Vínculo com Proposta</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex gap-4">
              <div class="flex flex-col">
                <label class="text-sm text-gray-600 mb-1">Data de Criação</label>
                <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[86px] h-[19px]" />
              </div>
              <div class="flex flex-col">
                <label class="text-sm text-gray-600 mb-1">Vencimento</label>
                <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[86px] h-[19px]" />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Código do Contrato</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Partes Envolvidas</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Status</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Ações</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[19px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Descrição</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[37px]" />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-600 mb-1">Permissões</label>
              <input type="text" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[179px] h-[37px]" />
            </div>
          </div>
          
          <div class="mt-auto flex justify-end pt-6">
            <button class="cadastro bg-brand-cad8fd border border-brand-3b67d0 text-white font-bold rounded-lg px-8 py-3 shadow-md  transition-colors">
              Salvar e Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../components/Progressbar.vue';
import WorkflowSteps from '../components/WorkflowSteps.vue';
import SignatureBox from '../components/SignatureBox.vue';
import FileDropzone from '../components/FileDropzone.vue';

export default {
  components: {
    ProgressBar,
    WorkflowSteps,
    SignatureBox,
    FileDropzone,
  },
  data() {
    return {
      stepsData: [
        { id: 1, name: 'Rascunho', status: 'completed' },
        { id: 2, name: 'Criação', status: 'completed' },
        { id: 3, name: 'Negociação', status: 'completed' },
        { id: 4, name: 'Assinatura', status: 'active' },
      ],
    };
  },
  methods: {
    handleUploadedFile(file) {
      console.log('Arquivo recebido no componente pai:', file);
      // Lógica de upload aqui
    },
  },
};
</script>
<style scoped>
.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}
</style>