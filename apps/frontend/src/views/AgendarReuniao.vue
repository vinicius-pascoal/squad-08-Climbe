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
                                        <input :class="participantes-search" type="text" v-model="participanteSearch" placeholder="Digite..."
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
                            <button class="prev-month" @click="prevMonth"></button>
                            <select class="month-selector" v-model="viewMonth">
                                <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}
                                </option>
                            </select>
                            <select class="year-selector" v-model="viewYear">
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <button class="next-month" @click="nextMonth"></button>
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
/* Container principal da página com o estilo de fonte base */
.page-container {
    background-color: #f4f5f7;
    padding: 2rem;
    font-family: 'Roboto', sans-serif; /* Fonte base */
    color: #333;
}

/* Cabeçalho da página com layout flexível para título e ícones */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

/* Estilo do título principal da página */
.page-header h1 {
    font-size: 2.5rem; /* Mantém o tamanho original para hierarquia */
    font-weight: 700; /* Peso da fonte solicitado */
    line-height: 48px; /* Altura de linha para o título principal */
    letter-spacing: 0;
}

/* Contêiner para ícones no cabeçalho (para uso futuro) */
.header-icons {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: #555;
}

/* Estilo para avatar de usuário (para uso futuro) */
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #333;
    border: 2px solid white;
}

/* Layout de grade para o conteúdo principal - formulário e calendário */
.content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: stretch;
}

/* Layout flex para as colunas do formulário e calendário */
.form-column,
.calendar-column {
    display: flex;
    flex-direction: column;
}

/* Garante que os cards dentro das colunas ocupem todo o espaço vertical disponível */
.form-column .card,
.calendar-column .card {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Estilo dos cards com fundo branco, cantos arredondados e sombra */
.card {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

/* Conteúdo do formulário expandindo para preencher o card */
.form-content {
    flex-grow: 1;
}

/* Espaçamento entre grupos de formulário */
.form-group {
    margin-bottom: 1.25rem;
}

/* Estilo para as labels dos campos de formulário */
.form-group label {
    display: block;
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: 1.5; /* Altura de linha proporcional para não quebrar */
    letter-spacing: 0;
    margin-bottom: 0.5rem;
}

/* Estilo padrão para inputs de texto, hora e áreas de texto */
input[type="text"],
input[type="time"],
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: normal; /* Altura de linha normal para campos de input */
    letter-spacing: 0;
    box-sizing: border-box;
}

/* Adiciona sombra específica para os campos principais do formulário */
#titulo,
#data,
#empresa,
#local,
.participantes-box,
#pauta {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

/* Remove a alça de redimensionamento padrão do textarea */
textarea {
    resize: none;
    overflow: hidden;
}

/* Layout flexível para linhas do formulário com múltiplos campos */
.form-row {
    display: flex;
    gap: 1rem;
}

/* Faz com que cada grupo em uma linha ocupe espaço igual */
.form-row .form-group {
    flex: 1;
}

/* Container para input de data com posição relativa para acomodar ícones */
.date-input {
    position: relative;
}

/* Estilo do input de data com espaço à direita para o ícone */
.date-input input {
    padding-right: 2.5rem;
    background-color: #fff;
}

/* Posicionamento do ícone dentro do campo de data */
.date-input span {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

/* Container flexível para os slots de tempo */
.time-slots-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.5rem;
}

/* Botões de slot de tempo com estilo neutro e cantos arredondados */
.time-slot {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 16px; /* Ajustado para caber melhor */
    line-height: normal; /* Altura de linha normal para botões */
    letter-spacing: 0;
    transition: background-color 0.2s, border-color 0.2s;
}

/* Efeito hover para slot de tempo */
.time-slot:hover {
    background-color: #e0e0e0;
}

/* Destaque visual para o slot de tempo selecionado */
.time-slot.selected {
    background-color: rgba(14, 154, 151, 1); /* Cor de fundo solicitada */
    color: rgba(255, 255, 255, 1); /* Cor do texto solicitada (branco) */
    border-color: rgba(14, 154, 151, 1); /* Mantém a borda consistente */
}

/* Grupo de botões de rádio com layout flexível */
.radio-group {
    display: flex;
    align-items: center;
    gap: 1rem; /* Aumenta o espaço para acomodar a sombra */
    padding-top: 0.75rem;
}

/* Customização dos botões de rádio para aplicar a sombra */
.radio-group input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    width: 20px;
    height: 20px;
    background-color: rgba(217, 217, 217, 1); /* Cor para o estado não selecionado */
    border: none; /* Remove a borda para um visual mais limpo */
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); /* Sombra aplicada */
}

.radio-group input[type="radio"]:checked {
    background-color: rgba(14, 154, 151, 1); /* Cor de fundo solicitada */
    border-color: rgba(14, 154, 151, 1); /* Borda da mesma cor para um visual sólido */
    background-image: url("data:image/svg+xml,%3csvg width='13' height='12' viewBox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M10.86 0L12.468 1.128L5.496 11.184H3.888L0 5.736L1.608 4.236L4.692 7.116L10.86 0Z' fill='white'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 10px;
}

/* Remove o círculo interno anterior, pois agora usamos um SVG */
.radio-group input[type="radio"]:checked::before {
    content: none;
}

/* Remove o espaçamento e o peso da fonte para labels dentro do grupo de rádio */
.radio-group label {
    margin-bottom: 0;
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
}

/* Botão para definir meet com borda tracejada e fundo claro */
.btn-definir-meet {
    width: 100%;
    padding: 0.75rem;
    border: 1px dashed #ccc;
    background-color: #f9f9f9;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
}

/* Container para o seletor de participantes com posicionamento relativo */
.participantes-container {
    position: relative;
}

/* Caixa para mostrar participantes selecionados como chips */
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

/* Input para busca de participantes dentro da caixa */
.participantes-input {
    border: none;
    outline: none;
    padding: 0.25rem;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
    flex-grow: 1;
}

/* Lista suspensa de usuários durante a busca */
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

/* Itens da lista de usuários */
.user-list li {
    padding: 0.75rem;
    cursor: pointer;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: 1.5; /* Altura de linha proporcional */
    letter-spacing: 0;
}

/* Efeito hover para itens da lista de usuários */
.user-list li:hover {
    background-color: #f0f0f0;
}

/* Estilo para os chips de participantes selecionados */
.chip {
    background-color: #e0e0e0;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 16px; /* Ajustado para caber melhor */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
}

/* Botão de remoção dentro do chip de participante */
.chip button {
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    padding: 0;
    line-height: 1;
}

/* Container do calendário na coluna direita */
.calendar-container {
    margin-bottom: 2rem;
}

/* Cabeçalho do calendário com navegação entre meses */
.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem; /* Adiciona um espaçamento entre os elementos */
}

/* Estilo comum para os botões de navegação de mês */
.prev-month,
.next-month {
    border: none;
    border-radius: 4px;
    width: 38px; /* Tamanho fixo */
    height: 38px; /* Tamanho fixo */
    background-color: #fff;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 10px;
    transition: background-color 0.2s;
}

.prev-month:hover,
.next-month:hover {
    background-color: #f0f0f0;
}

/* Botão para navegar para o mês anterior */
.prev-month {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 10 21' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M9.6 2.3L3.3 10.5l6.3 8.2-1.9 2.3L-.002 10.5 7.7 0l1.9 2.3z' fill='%235F6060' fill-opacity='0.7'/%3e%3c/svg%3e");
}

/* Botão para navegar para o próximo mês */
.next-month {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 10 21' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M.398 18.7L6.7 10.5.398 2.3l1.9-2.3L10 10.5 2.3 21l-1.9-2.3z' fill='%235F6060' fill-opacity='0.7'/%3e%3c/svg%3e");
}

/* Estilo comum para os seletores de mês e ano */
.month-selector,
.year-selector {
    flex-grow: 1; /* Faz com que ocupem o espaço disponível */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
    color: #333;
    cursor: pointer;
    background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 16px;
}

/* Título da seção de eventos próximos */
.eventos-section h3 {
    font-size: 18px; /* Tamanho da fonte solicitado */
    font-weight: 700; /* Peso da fonte solicitado */
    line-height: 1.5; /* Altura de linha proporcional */
    letter-spacing: 0;
    margin-bottom: 1rem;
}

/* Card de evento na lista de próximos eventos */
.evento-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #e9f5ff;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

/* Avatar do criador do evento */
.evento-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

/* Informações do evento (título e data) */
.evento-info {
    flex-grow: 1;
}

/* Parágrafos dentro da seção de informações do evento */
.evento-info p {
    margin: 0;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 16px; /* Ajustado para caber melhor */
    line-height: 1.4; /* Altura de linha proporcional */
    letter-spacing: 0;
}

/* Horário do evento */
.evento-hora {
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 16px; /* Ajustado para caber melhor */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
}

/* Container para os botões de ação (Cancelar e Agendar) */
.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: auto;
    padding-top: 2rem;
}

/* Estilo base para os botões de ação */
.action-buttons button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif; /* Garante a herança da fonte */
    font-weight: 700; /* Peso da fonte solicitado */
    font-size: 18px; /* Tamanho da fonte solicitado */
    line-height: normal; /* Altura de linha normal */
    letter-spacing: 0;
    cursor: pointer;
    transition: opacity 0.2s;
}

/* Efeito hover para os botões de ação */
.action-buttons button:hover {
    opacity: 0.9;
}

/* Botão de cancelar com fundo vermelho */
.btn-cancelar {
    background-color: #ff4d4f;
    color: white;
}

/* Botão de agendar com fundo verde */
.btn-agendar {
    background-color: #28a745;
    color: white;
}
</style>