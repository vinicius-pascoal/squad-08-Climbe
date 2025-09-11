<script>
import StatusPill from './StatusPill.vue';

export default {
  components: { StatusPill },
  emits: ['change-status'],
  props: {
    userId: { type: [Number, String], required: true },
    name: { type: String, default: 'João Silva' },
    email: { type: String, default: 'joao@exemplo.com' },
    cargo: { type: String, default: '—' },
    permisao: { type: String, default: '—' },
    status: {
      type: String,
      default: 'pendente',
      validator: (v) => ['ativo', 'pendente', 'inativo'].includes((v || '').toLowerCase()),
    },
    updating: { type: Boolean, default: false },
  },
  data() {
    return { open: false };
  },
  computed: {
    isDisabled() {
      return this.updating || (this.status || '').toLowerCase() === 'ativo';
    }
  },
  methods: {
    toggle() {
      if (this.isDisabled) return;
      this.open = !this.open;
    },
    approve() {
      if (this.isDisabled) return;
      this.$emit('change-status', { userId: Number(this.userId), status: 'ativo' });
      this.open = false;
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
      <button
        class="inline-flex items-center gap-1 focus:outline-none disabled:opacity-60"
        @click.stop="toggle"
        :disabled="isDisabled"
        :title="isDisabled ? 'Usuário já está ativo' : 'Aprovar usuário'"
      >
        <StatusPill :status="status" />
        <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 011.04 1.08l-4.24 3.835a.75.75 0 01-1.04 0L5.25 8.29a.75.75 0 01-.02-1.08z" clip-rule="evenodd" />
        </svg>
      </button>

      <div v-if="open" class="absolute top-[48px] right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px]">
        <ul class="py-1 text-sm text-[#5F6060]">
          <li>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100" @click.stop="approve">
              Aprovar (Ativar)
            </button>
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<style scoped>
td { position: relative; }
</style>
