<script>
import StatusPill from './StatusPill.vue';
import { http } from '../lib/http';
import Swal from 'sweetalert2';

export default {
  components: { StatusPill },
  emits: ['change-status', 'removed', 'edit'],
  props: {
    userId: { type: [Number, String], required: true },
    name: { type: String, default: 'João Silva' },
    email: { type: String, default: 'joao@exemplo.com' },
    cargo: { type: String, default: '—' },
    permisao: { type: String, default: '—' },
    canApprove: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: false },
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
    onEdit() {
      if (!this.canEdit || this.updating) return;
      this.$emit('edit');
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
  <tr class="hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 transition">
    <td class="py-4 px-6 text-left">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-14b8a6 to-brand-0e9a97 flex items-center justify-center text-white font-semibold text-sm">
          {{ name.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium text-brand-000 dark:text-white">{{ name }}</span>
      </div>
    </td>

    <td class="py-4 px-6 text-left">
      <span class="text-brand-5f6060 dark:text-brand-e5e7eb">{{ cargo }}</span>
    </td>

    <td class="py-4 px-6 text-left">
      <span class="text-brand-5f6060 dark:text-brand-e5e7eb text-sm">{{ email }}</span>
    </td>

    <td class="py-4 px-6 text-center">
      <span class="text-brand-5f6060 dark:text-brand-e5e7eb text-sm">{{ permisao }}</span>
    </td>

    <td class="py-4 px-6 relative">
      <div class="flex items-center justify-center gap-3">
        <button class="inline-flex items-center gap-1 focus:outline-none disabled:opacity-60 hover:scale-105 transition"
          @click.stop="toggle" :disabled="isDisabled" :title="isDisabled ? 'Usuário já está ativo' : 'Aprovar usuário'">
          <StatusPill :status="status" />
          <svg v-if="!isDisabled" class="w-4 h-4 text-brand-5f6060 dark:text-brand-e5e7eb" viewBox="0 0 20 20"
            fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 011.04 1.08l-4.24 3.835a.75.75 0 01-1.04 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <button v-if="canEdit"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-brand-3b67d0 dark:text-brand-14b8a6 hover:bg-brand-cad8fd dark:hover:bg-brand-14b8a6/20 focus:outline-none transition"
          :disabled="updating" @click.stop="onEdit" title="Editar usuário">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button v-if="canRemove"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-brand-d32f2f dark:text-brand-ef4444 hover:bg-brand-fddede dark:hover:bg-brand-d32f2f/20 focus:outline-none transition"
          :disabled="updating || removing" @click.stop="onRemove" title="Remover usuário">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <div v-if="open"
        class="absolute top-[56px] right-0 z-50 bg-white dark:bg-brand-0e9a97 border border-brand-e5e7eb dark:border-brand-0e9989 rounded-lg shadow-xl min-w-[260px] p-4">
        <div class="text-sm text-brand-5f6060 dark:text-white mb-2 font-semibold">Selecionar cargo</div>
        <select v-model="selectedCargoId"
          class="w-full mb-3 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 px-3 py-2 text-brand-5f6060 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary">
          <option value="">Selecione</option>
          <option v-for="c in cargos" :key="c.id" :value="c.id">{{ c.nomeCargo }}</option>
        </select>
        <button
          class="w-full px-4 py-2 rounded-lg bg-brand-cad8fd dark:bg-brand-14b8a6 text-white hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          :disabled="!selectedCargoId" @click.stop="approve">
          Aprovar e Ativar
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
