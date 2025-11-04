<script>
import StatusPill from './StatusPill.vue';
import { http } from '../lib/http';
import Swal from 'sweetalert2';

export default {
  components: { StatusPill },
  emits: ['change-status', 'removed'],
  props: {
    userId: { type: [Number, String], required: true },
    name: { type: String, default: 'João Silva' },
    email: { type: String, default: 'joao@exemplo.com' },
    cargo: { type: String, default: '—' },
    permisao: { type: String, default: '—' },
    canApprove: { type: Boolean, default: true },
    status: {
      type: String,
      default: 'pendente',
      validator: (v) => ['ativo', 'pendente', 'desativado'].includes((v || '').toLowerCase()),
    },
    cargos: { type: Array, default: () => [] }, // [{id, nomeCargo}]
    updating: { type: Boolean, default: false },
    canRemove: { type: Boolean, default: false },
  },
  data() {
    return { open: false, selectedCargoId: '', removing: false };
  },
  computed: {
    isDisabled() {
      return this.updating || (this.status || '').toLowerCase() === 'ativo';
    }
  },
  methods: {
    toggle() {
      if (this.isDisabled || !this.canApprove) return;
      this.open = !this.open;
    },
    approve() {
      if (this.isDisabled || !this.canApprove) return;
      const id = Number(this.selectedCargoId);
      if (!id) return;
      this.$emit('change-status', { userId: Number(this.userId), status: 'ativo', cargoId: id });
      this.open = false;
      this.selectedCargoId = '';
    },
    async onRemove() {
      if (!this.canRemove || this.updating) return;
      const confirm = await Swal.fire({
        title: 'Confirmar remoção',
        text: 'Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar'
      });

      if (!confirm || !confirm.isConfirmed) return;

      this.removing = true;
      try {
        await http(`/api/usuarios/${this.userId}`, { method: 'DELETE' });
        await Swal.fire({ icon: 'success', title: 'Removido', text: 'Usuário removido com sucesso.' });
        this.$emit('removed', { userId: Number(this.userId) });
      } catch (e) {
        console.error('Erro ao remover usuário', e);
        await Swal.fire({ icon: 'error', title: 'Erro', text: e?.message || 'Falha ao remover usuário.' });
      } finally {
        this.removing = false;
      }
    },
    close() { this.open = false; },
  },
};
</script>

<template>
  <tr class="border-b grid grid-cols-6 items-center justify-center border shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 text-center grid grid-cols-3 items-center justify-center">
      <img src="/icones/usuariocard.svg" alt="" class="inline-block " />
      <div class=" ml-2 flex justify-start text-left col-span-2">
        {{ name }}
      </div>
    </td>

    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 text-center">
      {{ cargo }}
    </td>

    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 col-span-2 text-center">
      {{ email }}
    </td>

    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 text-center">
      {{ permisao }}
    </td>

    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 flex justify-center items-center relative">
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-1 focus:outline-none disabled:opacity-60" @click.stop="toggle"
          :disabled="isDisabled" :title="isDisabled ? 'Usuário já está ativo' : 'Aprovar usuário'">
        <StatusPill :status="status" />
        <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 011.04 1.08l-4.24 3.835a.75.75 0 01-1.04 0L5.25 8.29a.75.75 0 01-.02-1.08z"
            clip-rule="evenodd" />
        </svg>
        </button>

        <button v-if="canRemove"
          class="inline-flex items-center gap-1 text-red-600 hover:text-red-800 focus:outline-none"
          :disabled="updating || removing" @click.stop="onRemove" title="Remover usuário">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <div v-if="open"
        class="absolute top-[48px] right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[240px] p-3">
        <div class="text-sm text-brand-5f6060 mb-2 font-medium">Selecionar cargo</div>
        <select v-model="selectedCargoId"
          class="w-full mb-3 rounded-lg border bg-brand-f6f7f8 px-3 py-2 text-brand-5f6060">
          <option value="">Selecione</option>
          <option v-for="c in cargos" :key="c.id" :value="c.id">{{ c.nomeCargo }}</option>
        </select>
        <button
          class="w-full px-4 py-2 rounded-lg bg-brand-cad8fd text-brand-3b67d0 border border-brand-3b67d0 disabled:opacity-50"
          :disabled="!selectedCargoId" @click.stop="approve">
          Aprovar (Ativar)
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
td {
  position: relative;
}
</style>
