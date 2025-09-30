<template>
  <div class="bg-white p-4 rounded-lg shadow-md flex-1">
    <div class="flex items-center gap-2 mb-2">
      <p class="font-semibold text-gray-800">Etapa {{ stepNumber }}</p>
      <span class="text-gray-600">{{ stepName }}</span>
      <img
        v-if="status === 'completed'"
        src="/icones/checkitem.svg"
        alt="Etapa Concluída"
        class="w-4 h-4"
      />
    </div>
    <div class="w-full h-1 bg-gray-300 rounded-full">
      <div 
        class="h-full bg-[#17BFBD] rounded-full"
        :style="{ width: status === 'active' ? '50%' : '100%' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepNumber: {
      type: Number,
      required: true
    },
    stepName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      validator: (value) => ['completed', 'active', 'pending'].includes(value)
    }
  }
};
</script>

