<script>
import StatusPill from './StatusPill.vue'; // Assuming the component is in the same directory

export default {
  components: {
    StatusPill,
  },
  props: {
    name: {
      type: String,
      default: 'João Silva',
    },
    email: {
      type: String,
      default: 'joão.silva@yahoo.com',
    },
    cargo: {
      type: String,
      default: 'Gerente',
    },
    permisao: {
      type: String,
      default: 'aprova contratos',
    },
    status: {
      type: String,
      default: 'pendente',
    },
}
};
</script>
<template>

  <tr class="border-b grid grid-cols-6 items-center justify-center border  shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 text-center grid grid-cols-3 items-center justify-center">
      <img src="/icones/usuariocard.svg" alt="" class="inline-block " />
      <div class=" ml-2 flex justify-start text-left col-span-2">
        {{ name }}
      </div>
    </td>
    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 text-center">{{ cargo }}</td>
    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 col-span-2 text-center">{{ email }}</td>
    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 text-center">{{ permisao }}</td>
    <td class="[0_4px_4px_0_rgba(0,0,0,0.25)] py-4 px-6 flex justify-center items-center ">
      <StatusPill :status="status" />
    </td>
  </tr>
</template>