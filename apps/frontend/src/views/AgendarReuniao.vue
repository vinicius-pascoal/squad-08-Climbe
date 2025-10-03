<template>
    <div class="page-container">
        <header class="page-header">
            <h1>Agendar Reunião</h1>
        </header>

        <main class="content-grid">

            <div class="form-column">
                <div class="card">
                    <div class="form-content">
                        <div class="form-group">
                            <label for="titulo">Título</label>
                            <input type="text" id="titulo" v-model="reuniao.titulo">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="data">Data</label>
                                <div class="date-input">
                                    <input type="text" id="data" :value="formattedDate" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="hora">Hora</label>
                                <div class="time-slots-container">
                                    <button v-for="slot in timeSlots" :key="slot" class="time-slot"
                                        :class="{ 'selected': reuniao.comeco === slot }" @click="selectTime(slot)">
                                        {{ slot }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="empresa">Empresa</label>
                                <input type="text" id="empresa" v-model="reuniao.empresa">
                            </div>
                            <div class="form-group">
                                <label>Tipo</label>
                                <div class="radio-group">
                                    <input type="radio" id="online" value="Online" v-model="reuniao.tipo" checked>
                                    <label for="online">Online</label>
                                    <input type="radio" id="presencial" value="Presencial" v-model="reuniao.tipo">
                                    <label for="presencial">Presencial</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="local">Local</label>
                                <input type="text" id="local" v-model="reuniao.local">
                            </div>
                            <!--
                            <div class="form-group">
                                <label>Meeting room</label>
                                <button class="btn-definir-meet">+ Definir meet</button>
                            </div>
                            -->
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Participantes</label>
                                <div class="participantes-container">
                                    <div class="participantes-box">
                                        <span v-for="p in reuniao.participantes" :key="p.id" class="chip">
                                            {{ p.name }} <button @click="removerParticipante(p)">×</button>
                                        </span>
                                        <input type="text" v-model="participanteSearch" placeholder="Pesquisar..."
                                            class="participantes-input" @focus="showUserList = true"
                                            @blur="hideUserList">
                                    </div>
                                    <ul v-if="showUserList && filteredUsers.length" class="user-list">
                                        <li v-for="user in filteredUsers" :key="user.id"
                                            @click="adicionarParticipante(user)">
                                            {{ user.name }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="pauta">Pauta</label>
                                <textarea id="pauta" v-model="reuniao.pauta" rows="3"
                                    @input="autoResizeTextarea"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna do Calendário (Direita) -->
            <div class="calendar-column">
                <div class="card">
                    <div class="calendar-container">
                        <div class="calendar-header">
                            <button @click="prevMonth">&lt;</button>
                            <select class="month-selector" v-model="viewMonth">
                                <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}
                                </option>
                            </select>
                            <select class="year-selector" v-model="viewYear">
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <button @click="nextMonth">&gt;</button>
                        </div>
                        <Calendar :activities="proximosEventos" :view-date="viewDate" @date-selected="onDateSelected" />
                    </div>

                    <div class="eventos-section">
                        <h3>Próximos eventos</h3>
                        <div class="evento-item" v-for="evento in proximosEventos" :key="evento.id">
                            <img :src="evento.avatar" class="evento-avatar" alt="Avatar">
                            <div class="evento-info">
                                <p>{{ evento.title }}</p>
                                <p>{{ formatarDataEvento(evento.date) }}</p>
                            </div>
                            <div class="evento-hora">{{ evento.time }}</div>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-cancelar" @click="cancelar">Cancelar</button>
                        <button class="btn-agendar" @click="agendarReuniao">Agendar</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>


<script setup>

import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Calendar from '../components/Calendar.vue';

const router = useRouter();

const reuniao = ref({
    titulo: '',
    data: new Date(),
    comeco: '',
    empresa: '',
    tipo: 'Online',
    local: '',
    participantes: [],
    pauta: ''
});

const allUsers = ref([]);
const participanteSearch = ref('');
const showUserList = ref(false);

const filteredUsers = computed(() => {
    if (!participanteSearch.value) {
        return allUsers.value.filter(user =>
            !reuniao.value.participantes.some(p => p.id === user.id)
        );
    }
    return allUsers.value.filter(user =>
        user.name.toLowerCase().includes(participanteSearch.value.toLowerCase()) &&
        !reuniao.value.participantes.some(p => p.id === user.id)
    );
});

// BACKEND: Substituir por uma chamada de API real para buscar usuários.
async function fetchUsers() {
    try {
        const mockUsers = [
            { id: 1, nome: 'Alice' },
            { id: 2, nome: 'Bruno' },
            { id: 3, nome: 'Carla' },
            { id: 4, nome: 'Daniel' },
            { id: 5, nome: 'Eduarda' }
        ];
        allUsers.value = mockUsers.map(user => ({ id: user.id, name: user.nome }));
    } catch (error) {
        console.error("Erro ao buscar usuários (mock):", error);
    }
}

onMounted(() => {
    fetchUsers();
});

function adicionarParticipante(user) {
    reuniao.value.participantes.push(user);
    participanteSearch.value = '';
}

function removerParticipante(participante) {
    reuniao.value.participantes = reuniao.value.participantes.filter(p => p.id !== participante.id);
}

function hideUserList() {
    setTimeout(() => {
        showUserList.value = false;
    }, 200);
}

async function agendarReuniao() {
    if (!reuniao.value.titulo || !reuniao.value.data || !reuniao.value.comeco) {
        alert('Por favor, preencha Título, Data e Hora.');
        return;
    }

    const [horas, minutos] = reuniao.value.comeco.split(':');
    const dataHoraInicio = new Date(reuniao.value.data);
    dataHoraInicio.setHours(parseInt(horas, 10));
    dataHoraInicio.setMinutes(parseInt(minutos, 10));
    dataHoraInicio.setSeconds(0, 0);

    const payload = {
        titulo: reuniao.value.titulo,
        pauta: reuniao.value.pauta,
        data_hora_inicio: dataHoraInicio.toISOString(),
        local: reuniao.value.local,
        tipo: reuniao.value.tipo,
        participantes: reuniao.value.participantes.map(p => p.id)
    };

    // BACKEND: Substituir o console.log por uma chamada de API real (api.post('/reunioes', payload)).
    console.log('Payload da Reunião (simulando envio):', payload);

    alert('Reunião agendada com sucesso!');
    router.push('/agenda');
}

function cancelar() {
    router.push('/agenda');
}

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'];

const proximosEventos = ref([
    { id: 1, title: 'Daily Scrum', date: new Date(2025, 9, 29), time: '10:00 AM', avatar: '' },
    { id: 2, title: 'Review Sprint', date: new Date(2025, 9, 29), time: '11:00 AM', avatar: '' }
]);

function formatarDataEvento(date) {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

function selectTime(time) {
    reuniao.value.comeco = time;
}

const selectedDate = ref(reuniao.value.data);
const viewDate = ref(new Date(reuniao.value.data));

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const years = computed(() => Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i));

const viewMonth = ref(viewDate.value.getMonth());
const viewYear = ref(viewDate.value.getFullYear());

watch([viewYear, viewMonth], ([newYear, newMonth]) => {
    viewDate.value = new Date(newYear, newMonth, 1);
});

watch(viewDate, (newDate) => {
    if (newDate.getFullYear() !== viewYear.value) {
        viewYear.value = newDate.getFullYear();
    }
    if (newDate.getMonth() !== viewMonth.value) {
        viewMonth.value = newDate.getMonth();
    }
});

const formattedDate = computed(() => {
    if (!selectedDate.value) return '';
    const day = selectedDate.value.getDate();
    const monthName = months[selectedDate.value.getMonth()];
    const year = selectedDate.value.getFullYear();
    return `${day} ${monthName} ${year}`;
});

function onDateSelected(date) {
    selectedDate.value = date;
    reuniao.value.data = date;
    if (date.getMonth() !== viewDate.value.getMonth() || date.getFullYear() !== viewDate.value.getFullYear()) {
        viewDate.value = new Date(date);
    }
}

function prevMonth() {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
}

function nextMonth() {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
}

function autoResizeTextarea(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}
</script>

<style scoped>
.page-container {
    background-color: #f4f5f7;
    padding: 2rem;
    font-family: sans-serif;
    color: #333;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: bold;
}

.header-icons {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: #555;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #333;
    border: 2px solid white;
}

.content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: stretch;
}

.form-column,
.calendar-column {
    display: flex;
    flex-direction: column;
}

.form-column .card,
.calendar-column .card {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.card {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.form-content {
    flex-grow: 1;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

input[type="text"],
input[type="time"],
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

textarea {
    resize: none;
    overflow: hidden;
}

.form-row {
    display: flex;
    gap: 1rem;
}

.form-row .form-group {
    flex: 1;
}

.date-input {
    position: relative;
}

.date-input input {
    padding-right: 2.5rem;
    background-color: #fff;
}

.date-input span {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.time-slots-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.5rem;
}

.time-slot {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s, border-color 0.2s;
}

.time-slot:hover {
    background-color: #e0e0e0;
}

.time-slot.selected {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}

.radio-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.75rem;
}

.radio-group label {
    margin-bottom: 0;
    font-weight: normal;
}

.btn-definir-meet {
    width: 100%;
    padding: 0.75rem;
    border: 1px dashed #ccc;
    background-color: #f9f9f9;
    border-radius: 4px;
    cursor: pointer;
}

.participantes-container {
    position: relative;
}

.participantes-box {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    min-height: 40px;
    align-items: center;
}

.participantes-input {
    border: none;
    outline: none;
    padding: 0.25rem;
    font-size: 1rem;
    flex-grow: 1;
}

.user-list {
    position: absolute;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 150px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-list li {
    padding: 0.75rem;
    cursor: pointer;
}

.user-list li:hover {
    background-color: #f0f0f0;
}

.chip {
    background-color: #e0e0e0;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.chip button {
    border: none;
    background: none;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    padding: 0;
    line-height: 1;
}

.calendar-container {
    margin-bottom: 2rem;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.calendar-header select,
.calendar-header button {
    border-radius: 4px;
    padding: 0.5rem;
    background-color: #fff;
    cursor: pointer;
}

.calendar-header select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    border: 1px solid #B4B7BF;
    border-radius: 4px;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-weight: 600;
    font-size: 14px;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    position: relative;
    background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 16px;
}

.eventos-section h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.evento-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #e9f5ff;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.evento-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.evento-info {
    flex-grow: 1;
}

.evento-info p {
    margin: 0;
    font-size: 0.9rem;
}

.evento-hora {
    font-size: 0.9rem;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: auto;
    padding-top: 2rem;
}

.action-buttons button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
}

.action-buttons button:hover {
    opacity: 0.9;
}

.btn-cancelar {
    background-color: #ff4d4f;
    color: white;
}

.btn-agendar {
    background-color: #28a745;
    color: white;
}
</style>