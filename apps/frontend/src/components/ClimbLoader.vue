<template>
  <div class="climb-loader fixed inset-0 z-[9999] flex items-center justify-center" role="status" aria-live="polite">
    <div class="overlay-bg" aria-hidden></div>

    <div class="loader-card">
      <div class="logo-wrap">
        <img src="/img/climbe-logo.png" alt="climb" class="logo-img" />

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
  background: rgba(6, 8, 10, 0.64);
  backdrop-filter: blur(6px) saturate(120%);
  /* capture pointer events so underlying app is not clickable during loading */
  pointer-events: auto;
}

.climb-loader {
  pointer-events: auto
}

.climb-loader {
  cursor: progress;
}

.loader-card {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px 18px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 40px rgba(2, 6, 23, 0.6), 0 6px 18px rgba(0, 0, 0, 0.45);
}

.logo-img {
  width: 128px;
  height: 128px;
  object-fit: contain;
  border-radius: 10px;
  position: relative;
  z-index: 2;
  display: block;
}

.loader-card {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* don't allow interactions on the loader card itself to fall through to the app */
  pointer-events: none;
}

.logo-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  animation: breathe 3.6s ease-in-out infinite;
  transform-origin: center;
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.18));
}

@keyframes breathe {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.18));
    box-shadow: none;
  }

  50% {
    transform: scale(1.06);
    filter: drop-shadow(0 18px 40px rgba(88, 201, 193, 0.18));
    box-shadow: 0 12px 44px rgba(88, 201, 193, 0.12);
  }

  100% {
    transform: scale(1);
    filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.18));
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-img {
    animation: none;
  }
}
</style>
