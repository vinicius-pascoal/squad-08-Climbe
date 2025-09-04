<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Adicionar Evento</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="type">Tipo:</label>
          <input type="text" id="type" v-model="newEvent.type" required />
        </div>
        <div class="form-group">
          <label for="participants">Participantes:</label>
          <input type="text" id="participants" v-model="newEvent.participants" />
        </div>
        <div class="form-group">
          <label for="date">Data:</label>
          <input type="date" id="date" v-model="newEvent.date" required />
        </div>
        <div class="form-group">
          <label for="time">Hora:</label>
          <input type="time" id="time" v-model="newEvent.time" required />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  selectedDate: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'add']);

const newEvent = ref({
  type: '',
  participants: '',
  date: '',
  time: ''
});

const handleSubmit = () => {
  const dateString = newEvent.value.date;
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  emit('add', { ...newEvent.value, date: dateObj });
  
  emit('close');
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.5rem;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type="text"],
input[type="date"],
input[type="time"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>