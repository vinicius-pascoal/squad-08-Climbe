<template>
  <div class="flex items-center justify-center h-screen bg-cover bg-center">
    <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
      <source src="/videos/climbeVideo.mp4" type="video/mp4" />
    </video>
    <!-- Overlay para escurecer -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Card principal -->
    <div
      class="relative z-10 flex w-4/5 h-4/5 max-w-5xl max-h-5xl rounded-2xl bg-neutral-600/50 border-2 border-neutral-700 backdrop-blur-sm shadow-lg overflow-hidden animate-fadeInUp justify-center align-middle">
      <!-- Coluna Login -->
      <div class=" flex flex-col items-center justify-center space-x-36-5 px-5 overlay-content ">
        <div>
          <img src="/img/climbe-logo.png" alt="climb" class="h-20 mb-6" />
          <h2 class="text-white text-3xl font-medium mb-6 mx-auto text-center">Portal do Sócio.</h2>
        </div>
        <div class="flex items-center w-full">
          <div class="sm:w-1/2 flex flex-col items-center">
            <input type="email" placeholder="Digite seu email" v-model="email"
              class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <input type="password" placeholder="Digite sua senha" v-model="password"
              class="w-full h-15 px-4 py-3 mb-6 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <p v-if="error" class=" text-red-500 mb-2 text-xl font-bold animate-shake-rotate ">{{ error }}</p>

            <div class="flex items-center justify-between w-full mb-4 gap-2">
              <button @click="login" :disabled="loading"
                class="w-full h-15 py-3 rounded-lg border-2 text-xl  border-primary  font-semibold text-white  bg-secondary hover:bg-neutral-500/20 hover:border-neutral-700 transition ">
                Acessar
              </button>

              <button @click="login"
                class="w-full h-15 py-3 rounded-lg border-2 text-xl  border-neutral-300  font-semibold text-black  bg-neutral-100 hover:bg-neutral-500/20 hover:border-neutral-700 transition text-center flex items-center justify-center gap-2">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" class="h-6" />
                <span>Google</span>
              </button>
            </div>
            <p class="text-white text-sm mt-4">
              É sócio e ainda não tem acesso?
              <a href="/cadastro" class="text-purple-400 hover:underline">Clique aqui</a>
            </p>
          </div>

          <!-- Divider gradiente -->
          <div
            class="w-[4px] h-4/5 bg-gradient-to-br from-primary via-transparent to-transparent mx-5 hidden sm:block ">
          </div>

          <!-- Coluna Texto com animação -->
          <div class="w-1/2 flex items-center justify-center p-10 hidden sm:block ">
            <h2 class="text-white text-4xl font-bold w-full h-full text-center font-bold text-6xl">
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { loginApi } from "../services/auth";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const loading = ref(false);

async function login() {
  error.value = null;
  loading.value = true;
  try {
    const res = await loginApi({ username: email.value, password: password.value });
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    router.push("/Home");
  } catch (e: any) {
    if (e?.status === 403) error.value = "Seu cadastro está pendente de aprovação.";
    else if (e?.status === 400) error.value = "Credenciais inválidas.";
    else error.value = e?.message || "Falha ao autenticar.";
  } finally {
    loading.value = false;
  }
}

// Texto animado
const fullText = "A melhor empresa precisa dos melhores orientadores";
const typedText = ref("");

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

  0%,
  50%,
  100% {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.5);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

@keyframes shake-rotate {

  10%,
  90% {
    transform: rotate(-1.5deg);
  }

  20%,
  80% {
    transform: rotate(1.5deg);
  }

  30%,
  50%,
  70% {
    transform: rotate(-2.5deg);
  }

  40%,
  60% {
    transform: rotate(2.5deg);
  }
}

.overlay-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent);
  animation: shimmer 3s infinite;
}

.animate-fadeInUp {
  animation: fadeInUp 2s ease-out forwards;
}

.animate-blink {
  animation: blink 1s infinite;
}

.animate-shake-rotate {
  animation: shake-rotate 1s;
}
</style>
