<template>
  <td class="grid grid-cols-4 p-3">
    <img :src="icon" alt="logo" class="place-self-center p-3" />
    <span class="font-medium col-span-3 p-3">{{ company }}</span>
  </td>
  <td class="p-3 text-center">{{ proposal }}</td>
  <td class="p-3 text-center">{{ validity }}</td>
  <td class="p-3 text-center">
    <span v-if="status === 'Aprovado'"
      class="aprovado px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-baecc9 border border-brand-128a3a text-brand-128a3a">Aprovado</span>
    <span v-else-if="status === 'Em revisão'"
      class="revisao px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-ffddad border border-brand-d08415 text-brand-d79334">Em
      revisão</span>
    <span v-else-if="status === 'Rescindido'"
      class="rescindido px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-f5ccc9 border border-brand-bf1f2b text-brand-bf1f2b">Rescindido</span>
  </td>
  <td class="text-center p-3">
    <button @click="$emit('open-contract')"
      class="py-1 px-3 text-center border shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] font-bold rounded-sm bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors">Abrir</button>
  </td>
</template>
<script setup>
defineProps({
  icon: String,
  company: String,
  proposal: String,
  validity: String,
  status: String
});

defineEmits(['open-contract']);
</script>

<script>
export default {
  props: {
    icon: String,
    company: String,
    proposal: String,
    validity: String,
    status: String,
  },
};
</script>

<style scoped>
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

.pingu {
  background-image: url('/icones/pingu.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.tedlogo {
  background-image: url('/icones/tedlogo.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.pwalogo {
  background-image: url('/icones/pwalogo.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}
</style>
