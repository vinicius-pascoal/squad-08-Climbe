<template>
  <button class="add-event-button" @click="$emit('click')">
    Adicionar Evento
  </button>
</template>

<script setup>
defineEmits(['click']);
</script>

<style scoped>
.add-event-button {
  background-image: linear-gradient(to right, #1DEFD6, #16C3AF, #0E9989);
  color: white;
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  border-radius: 100px;
  font-weight: 800;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  letter-spacing: 1px;
}

.add-event-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
