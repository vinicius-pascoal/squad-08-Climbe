<template>
  <div :class="['status-pill', statusClass]">
    <img v-if="status === 'ativo'" src="/icones/certo.svg" alt="Ativo" class="icon" />
    <img v-if="status === 'pendente'" src="/icones/pendente.svg" alt="Pendente" class="icon" />
    <img v-if="status === 'inativo'" src="/icones/inativo.svg" alt="Inativo" class="icon" />
    <span>{{ status }}</span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['ativo', 'pendente', 'inativo'].includes(value.toLowerCase()),
    },
  },
  computed: {
    statusClass() {
      switch (this.status.toLowerCase()) {
        case 'ativo':
          return 'ativo-style';
        case 'pendente':
          return 'pendente-style';
        case 'inativo':
          return 'inativo-style';
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped>
.status-pill {
  display: flex; /* This is key to making the children side-by-side */
  align-items: center; /* This centers the icon and text vertically */
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.icon {
  width: 16px;
  height: 16px;
  margin-right: 8px; /* Add some space between the icon and the text */
}

.ativo-style {
  background-color: #d8f5e2;
  border: 1px solid #73b378;
  color: #1a7126;
}

.pendente-style {
  background-color: #ffecc6;
  border: 1px solid #c49646;
  color: #c49646;
}

.inativo-style {
  background-color: #e5e5e5;
  border: 1px solid #a3a3a3;
  color: #5f6060;
}
</style>