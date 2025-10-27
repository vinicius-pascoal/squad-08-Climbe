<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Adicionar Evento</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título:</label>
          <input type="text" id="title" v-model="newEvent.title" required />
        </div>

        <div class="form-group">
          <label for="description">Descrição:</label>
          <textarea id="description" v-model="newEvent.description" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="location">Local:</label>
          <input type="text" id="location" v-model="newEvent.location" />
        </div>

        <div class="form-group">
          <label for="date">Data:</label>
          <input type="date" id="date" v-model="newEvent.date" required />
        </div>

        <div class="form-group">
          <label for="time">Hora (HH:mm):</label>
          <input type="time" id="time" v-model="newEvent.time" />
        </div>

        <div class="form-group">
          <label for="emails">Emails (separados por vírgula):</label>
          <input type="text" id="emails" v-model="newEvent.emailsInput" placeholder="ex: a@ex.com, b@ex.com" />
        </div>

        <div class="form-row">
          <label><input type="checkbox" v-model="newEvent.isRemote" /> Remoto</label>
          <label><input type="checkbox" v-model="newEvent.notify" /> Notificar participantes</label>
        </div>

        <div class="form-group">
          <label for="priority">Prioridade:</label>
          <select id="priority" v-model="newEvent.priority">
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const props = defineProps({
  selectedDate: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'add']);

const instance = getCurrentInstance();
const $notify = instance?.appContext.config.globalProperties.$notify;

const newEvent = ref({
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
  emailsInput: '',
  isRemote: false,
  notify: true,
  priority: 'Média'
});

// Inicializa a data com a prop selectedDate quando houver
if (props.selectedDate) {
  const d = new Date(props.selectedDate);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  newEvent.value.date = `${yyyy}-${mm}-${dd}`;
}

const handleSubmit = () => {
  // validações básicas
  if (!newEvent.value.title) {
    $notify?.warning('Por favor, informe um título para o evento.');
    return;
  }
  if (!newEvent.value.date) {
    $notify?.warning('Por favor, informe a data do evento.');
    return;
  }

  // parse emails
  const emails = (newEvent.value.emailsInput || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // montar payload compatível com Home.vue AddPayload
  // converter a data string 'YYYY-MM-DD' para Date local (evita parse em UTC que desloca dia)
  let dateObj = undefined;
  if (typeof newEvent.value.date === 'string' && newEvent.value.date.includes('-')) {
    const [yStr, mStr, dStr] = newEvent.value.date.split('-');
    const y = Number(yStr || 0);
    const m = Number(mStr || 1) - 1;
    const d = Number(dStr || 1);
    dateObj = new Date(y, m, d);
  } else if (newEvent.value.date instanceof Date) {
    dateObj = new Date(newEvent.value.date);
  }

  const payload = {
    title: newEvent.value.title,
    description: newEvent.value.description,
    location: newEvent.value.location,
    date: dateObj,
    time: newEvent.value.time || undefined,
    emails: emails.length ? emails : undefined,
    isRemote: !!newEvent.value.isRemote,
    priority: newEvent.value.priority,
    notify: !!newEvent.value.notify
  };

  emit('add', payload);
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
  background-color: var(--color-fff);
  padding: 20px;
  border-radius: 8px;
  width: 520px;
  position: relative;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
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
input[type="time"],
input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-e0e0e0);
  border-radius: 6px;
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
  background-color: var(--color-26a69a);
  color: white;
  border-color: var(--color-26a69a);
}

button[type="submit"] {
  background-color: var(--color-26a69a);
  color: var(--color-fff);
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.btn-secondary {
  background: var(--color-e0e0e0);
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-26a69a);
  color: var(--color-fff);
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
