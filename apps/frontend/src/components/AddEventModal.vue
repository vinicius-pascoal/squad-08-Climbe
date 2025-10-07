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
          <label>Hora:</label>
          <div class="time-blocks">
            <button v-for="timeSlot in timeSlots" :key="timeSlot" type="button" class="time-block"
              :class="{ 'selected': newEvent.time === timeSlot }" @click="selectTime(timeSlot)">
              {{ timeSlot }}
            </button>
          </div>
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

// Array com os blocos de hora disponíveis
const timeSlots = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const newEvent = ref({
  type: '',
  participants: '',
  date: '',
  time: ''
});

const selectTime = (time) => {
  newEvent.value.time = time;
};

const handleSubmit = () => {
  if (!newEvent.value.time) {
    alert('Por favor, selecione um horário.');
    return;
  }

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
input[type="date"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.time-blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.time-block {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.time-block:hover {
  background-color: #e0e0e0;
}

.time-block.selected {
  background-color: #26A69A;
  color: white;
  border-color: #26A69A;
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