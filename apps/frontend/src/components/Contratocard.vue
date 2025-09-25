<template>
  <td class="grid grid-cols-4 p-3">
    <img :src="icon" alt="logo" class="place-self-center p-3" />
    <span class="font-medium col-span-3 p-3">{{ company }}</span>
  </td>
  <td class="p-3 text-center">{{ proposal }}</td>
  <td class="p-3 text-center">{{ validity }}</td>
  <td class="p-3 text-center">
                <span v-if="status === 'Aprovado'" class="aprovado px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#BAECC9] border border-[#128A3A] text-[#128A3A]">Aprovado</span>
                <span v-else-if="status === 'Em revisão'" class="revisao px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#FFDDAD] border border-[#D08415] text-[#D79334]">Em revisão</span>
                <span v-else-if="status === 'Rescindido'" class="rescindido px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#F5CCC9] border border-[#BF1F2B] text-[#BF1F2B]">Rescindido</span>
            </td>
            <td class="text-center p-3">
                <button class="py-1 px-3 text-center border shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] font-bold rounded-sm bg-white">Abrir</button>
            </td>
</template>
<script setup>
defineProps({
  icon: String,
  company: String,
  proposal: String,
  validity: String,
  status: String
})
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