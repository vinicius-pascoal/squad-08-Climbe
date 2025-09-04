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
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 100px; 
  box-shadow: 4px 5px 9px rgba(0, 0, 0, 0.25);
}
</style>