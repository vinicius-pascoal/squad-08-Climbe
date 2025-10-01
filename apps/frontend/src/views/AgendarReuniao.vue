<template>
    <div class="page-container">
        <header class="page-header">
            <h1>Agendar Reunião</h1>
        </header>

        <main class="content-grid">
            
            <div class="form-column">
                <div class="card">
                    <div class="form-content"> <!-- Div wrapper adicionada -->
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
                            <div class="form-group">
                                <label>Meeting room</label>
                                <button class="btn-definir-meet">+ Definir meet</button>
                            </div>
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
                                            class="participantes-input" @focus="showUserList = true" @blur="hideUserList">
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
                                <textarea id="pauta" v-model="reuniao.pauta" rows="3" @input="autoResizeTextarea"></textarea>
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
                            <select v-model="viewMonth">
                                <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}
                                </option>
                            </select>
                            <select v-model="viewYear">
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
// import api from '@/services/api'; // API removida temporariamente

const router = useRouter(); // Para navegação

// --- Dados do Formulário ---
const reuniao = ref({
    titulo: '',
    data: new Date(), // Inicia com a data atual
    comeco: '',
    empresa: '',
    tipo: 'Online', // Mantém 'Online' como padrão
    local: '',
    participantes: [], // Agora será um array de objetos
    pauta: ''
});

// --- Lógica dos Participantes ---
const allUsers = ref([]); // Armazenará todos os usuários do sistema
const participanteSearch = ref(''); // Termo de busca para participantes
const showUserList = ref(false); // Controla a visibilidade da lista de usuários

// Filtra os usuários com base na busca e que ainda não foram adicionados
const filteredUsers = computed(() => {
    if (!participanteSearch.value) {
        // Se não houver busca, mostra todos que não foram selecionados
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
        // Simula uma chamada de API
        const mockUsers = [
            { id: 1, nome: 'Alice' },
            { id: 2, nome: 'Bruno' },
            { id: 3, nome: 'Carla' },
            { id: 4, nome: 'Daniel' },
            { id: 5, nome: 'Eduarda' }
        ];
        // A API retorna 'nome', então mapeamos para 'name' para manter o resto do código
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
    participanteSearch.value = ''; // Limpa o input
}

function removerParticipante(participante) {
    reuniao.value.participantes = reuniao.value.participantes.filter(p => p.id !== participante.id);
}

// Pequeno delay para permitir o clique na lista antes que ela suma
function hideUserList() {
    setTimeout(() => {
        showUserList.value = false;
    }, 200);
}

// --- Lógica de Agendamento ---
async function agendarReuniao() {
    // Validação simples
    if (!reuniao.value.titulo || !reuniao.value.data || !reuniao.value.comeco) {
        alert('Por favor, preencha Título, Data e Hora.');
        return;
    }

    // 1. Combina a data e a hora em um objeto Date
    const [horas, minutos] = reuniao.value.comeco.split(':');
    const dataHoraInicio = new Date(reuniao.value.data);
    dataHoraInicio.setHours(parseInt(horas, 10));
    dataHoraInicio.setMinutes(parseInt(minutos, 10));
    dataHoraInicio.setSeconds(0, 0);

    // 2. Prepara o payload para a API
    const payload = {
        titulo: reuniao.value.titulo,
        pauta: reuniao.value.pauta,
        data_hora_inicio: dataHoraInicio.toISOString(), // Envia em formato ISO 8601
        local: reuniao.value.local,
        tipo: reuniao.value.tipo,
        // NOTA: A API espera um `empresaId`. Como o campo é de texto,
        // esta parte precisará de ajuste futuro (ex: um seletor de empresas).
        // Por enquanto, não enviaremos a empresa.
        participantes: reuniao.value.participantes.map(p => p.id) // Envia apenas os IDs
    };

    // BACKEND: Substituir o console.log por uma chamada de API real (api.post('/reunioes', payload)).
    console.log('Payload da Reunião (simulando envio):', payload);

    alert('Reunião agendada com sucesso!');
    router.push('/agenda'); // Redireciona para a agenda após o sucesso
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

// --- Lógica do Calendário (Adaptada de Home.vue) ---
const selectedDate = ref(reuniao.value.data);
const viewDate = ref(new Date(reuniao.value.data));

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const years = computed(() => Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i));

// Controladores para os <select> de mês e ano
const viewMonth = ref(viewDate.value.getMonth());
const viewYear = ref(viewDate.value.getFullYear());

// Observa mudanças nos selects e atualiza a data de visualização
watch([viewYear, viewMonth], ([newYear, newMonth]) => {
    viewDate.value = new Date(newYear, newMonth, 1);
});

// Observa mudanças na data de visualização e atualiza os selects
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
    reuniao.value.data = date; // Atualiza o formulário
    // Garante que a visualização do calendário mude se um dia de outro mês for clicado
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
    align-items: stretch; /* Mantém o alinhamento para esticar */
}

/* Esta é a chave para o alinhamento */
.form-column, .calendar-column {
    display: flex;
    flex-direction: column;
}

.form-column .card, .calendar-column .card {
    flex: 1; /* Faz com que cada card ocupe todo o espaço disponível na altura */
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

.form-content { /* Adicionar esta nova regra */
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
    resize: none; /* Remove a alça de redimensionamento */
    overflow: hidden; /* Esconde a barra de rolagem */
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

/* Coluna Direita */
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
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: #fff;
    cursor: pointer;
}

.calendar-header select {
    flex-grow: 1;
    margin: 0 0.5rem;
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
    height: 32px;   border-radius: 50%;
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
    margin-top: auto; /* Empurra os botões para o final do card */
    padding-top: 2rem; /* Adiciona um espaçamento acima dos botões */
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