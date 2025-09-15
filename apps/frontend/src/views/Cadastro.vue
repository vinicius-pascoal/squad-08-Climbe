<template>
  <div class="flex items-center justify-center h-full bg-cover bg-center">
    <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
      <source src="/videos/climbeVideo.mp4" type="video/mp4" />
    </video>
    <div class="absolute inset-0 bg-black/50"></div>

    <div class="relative z-10 flex w-4/5 h-full max-w-5xl rounded-2xl bg-neutral-600/50 border-2 border-neutral-700 backdrop-blur-sm shadow-lg overflow-hidden animate-fadeInUp justify-center align-middle">
      <div class="flex flex-col items-center justify-center px-5 overlay-content w-full md:w-4/5 py-10">
        <div class="mb-8 text-center">
          <img src="/img/climbe-logo.png" alt="climb" class="h-20 mb-6 mx-auto" />
          <h2 class="text-white text-3xl font-medium">Cadastro.</h2>
        </div>

        <div class="flex items-start w-full gap-6">
          <div class="w-full md:w-1/2 flex flex-col items-center">
            <input v-model="form.nomeCompleto" type="text" placeholder="Digite seu nome" class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input v-model="form.email" type="email" placeholder="Digite seu email" class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input v-model="form.contato" type="text" placeholder="Digite seu contato" class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input v-model="form.senha" type="password" placeholder="Digite sua senha" class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <p v-if="error" class="text-red-500 mb-2 text-center w-full">{{ error }}</p>
            <p v-if="success" class="text-green-400 mb-2 text-center w-full">{{ success }}</p>

            <div class="flex items-center justify-between w-full mb-4 gap-2">
              <button @click="register" :disabled="loading" class="w-full h-15 py-3 rounded-lg border-2 text-xl border-primary font-semibold text-white bg-secondary hover:bg-neutral-500/20 hover:border-neutral-700 transition disabled:opacity-50">
                {{ loading ? 'Enviando...' : 'Cadastrar' }}
              </button>
            </div>
            <p class="text-white text-sm mt-4">
              É sócio e já tem acesso?
              <a href="/" class="text-purple-400 hover:underline">Clique aqui</a>
            </p>
          </div>

          <div class="hidden md:flex w-1/2 items-center justify-center p-10">
            <h2 class="text-white text-4xl font-bold w-full h-full text-center">
              {{ typedText }}
              <span class="border-r-4 border-primary animate-blink ml-1"></span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { http } from '../lib/http';

const fullText = 'A melhor empresa precisa dos melhores orientadores';
const typedText = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const form = ref({
  nomeCompleto: '',
  email: '',
  contato: '',
  senha: '',
});

async function register() {
  try {
    loading.value = true;
    error.value = null;
    success.value = null;
    await http('/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });
    success.value = 'Cadastro realizado! Aguarde aprovação.';
    form.value = { nomeCompleto: '', email: '', contato: '', senha: '' };
  } catch (e: any) {
    error.value = e?.message || 'Falha ao cadastrar';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  let index = 0;
  const typingInterval = setInterval(() => {
    if (index < fullText.length) {
      typedText.value += fullText[index];
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 50);
});
</script>

<style>
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px) scale(0.5); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
.overlay-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}
.animate-fadeInUp { animation: fadeInUp 2s ease-out forwards; }
.animate-blink { animation: blink 1s infinite; }
</style>
