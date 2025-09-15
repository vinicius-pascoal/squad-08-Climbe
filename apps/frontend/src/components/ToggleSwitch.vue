<template>
  <div class="flex items-center space-x-2">
    <label :for="inputId" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <div
      :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', modelValue ? 'bg-[#18a29b]' : 'bg-gray-200']"
      @click="toggle"
    >
      <span
        :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', modelValue ? 'translate-x-6' : 'translate-x-1']"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      required: true
    },
    inputId: {
      type: String,
      required: true
    }
  },
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue);
    }
  }
};
</script>>