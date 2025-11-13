<template>
  <div class="climb-loader fixed inset-0 z-[9999] flex items-center justify-center" role="status" aria-live="polite">
    <div class="overlay-bg" aria-hidden="true"></div>

    <div class="loader-card">
      <div class="logo-wrap">
        <!-- Anel de progresso animado -->
        <div class="progress-ring">
          <svg class="ring-svg" viewBox="0 0 180 180">
            <circle class="ring-bg" cx="90" cy="90" r="82" />
            <circle class="ring-progress" cx="90" cy="90" r="82" />
          </svg>
        </div>

        <!-- Partículas orbitantes -->
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>

        <!-- Logo -->
        <img src="/img/climbe-logo.png" alt="climb" class="logo-img" />

        <!-- Brilho de fundo -->
        <div class="glow-effect"></div>
      </div>

      <!-- Texto de loading (opcional) -->
      <div class="loading-text">
        <span class="dot dot-1">.</span>
        <span class="dot dot-2">.</span>
        <span class="dot dot-3">.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.overlay-bg {
  position: absolute;
  inset: 0;
  background: rgba(6, 8, 10, 0.85);
  backdrop-filter: blur(12px) saturate(140%);
  pointer-events: auto;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.climb-loader {
  pointer-events: auto;
  cursor: progress;
}

.loader-card {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  pointer-events: none;
}

.logo-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Anel de progresso */
.progress-ring {
  position: absolute;
  inset: 0;
  animation: rotate 3s linear infinite;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 3;
}

.ring-progress {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 515;
  stroke-dashoffset: 515;
  animation: progress 2.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes progress {
  0% {
    stroke-dashoffset: 515;
    opacity: 0.6;
  }

  50% {
    stroke-dashoffset: 128;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: 515;
    opacity: 0.6;
  }
}

/* Partículas orbitantes */
.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #58c9c1, #4fb3ab);
  box-shadow: 0 0 16px rgba(88, 201, 193, 0.6), 0 0 8px rgba(88, 201, 193, 0.4);
  animation: orbit 4s linear infinite;
}

.particle-1 {
  animation-delay: 0s;
}

.particle-2 {
  animation-delay: 1.33s;
}

.particle-3 {
  animation-delay: 2.66s;
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(90px) scale(1);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    transform: rotate(360deg) translateX(90px) scale(0.8);
    opacity: 0;
  }
}

/* Logo */
.logo-img {
  width: 128px;
  height: 128px;
  object-fit: contain;
  border-radius: 12px;
  position: relative;
  z-index: 2;
  animation: breathe 3.6s ease-in-out infinite;
  transform-origin: center;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
}

@keyframes breathe {

  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
  }

  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 20px 48px rgba(88, 201, 193, 0.35));
  }
}

/* Brilho de fundo */
.glow-effect {
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle, rgba(88, 201, 193, 0.15) 0%, transparent 70%);
  animation: pulse 3.6s ease-in-out infinite;
  z-index: 1;
  border-radius: 50%;
  filter: blur(30px);
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

/* Texto de loading */
.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
}

.dot {
  color: rgba(255, 255, 255, 0.9);
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  animation: bounce 1.4s ease-in-out infinite;
}

.dot-1 {
  animation-delay: 0s;
}

.dot-2 {
  animation-delay: 0.2s;
}

.dot-3 {
  animation-delay: 0.4s;
}

@keyframes bounce {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-12px);
    opacity: 1;
  }
}

/* Modo redução de movimento */
@media (prefers-reduced-motion: reduce) {

  .logo-img,
  .progress-ring,
  .particle,
  .glow-effect,
  .dot {
    animation: none;
  }

  .logo-img {
    opacity: 1;
  }

  .ring-progress {
    stroke-dashoffset: 128;
    opacity: 0.8;
  }
}

/* Definição do gradiente (inline no SVG seria melhor, mas aqui está uma alternativa) */
.ring-progress {
  stroke: #58c9c1;
}
</style>
