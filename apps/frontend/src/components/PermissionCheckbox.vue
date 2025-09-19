<template>
  <div class="flex items-center space-x-2">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
      class="form-checkbox h-5 w-5 rounded border-gray-300"
    />
    <label :for="id" class="text-sm cursor-pointer text-[#5F6060] font-bold">{{ label }}</label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    modelValue: { // Para usar com v-model
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleChange(event) {
      this.$emit('update:modelValue', event.target.checked);
    },
  },
};
</script>

<style scoped>
/* Classes do Tailwind CSS aplicadas diretamente no template */
/* O estilo personalizado é necessário para garantir a cor exata do "tick" */
.form-checkbox:checked {
  border-color: #14b8a6; /* Cor similar ao teal-600 */
  background-color: #14b8a6;
}
</style>