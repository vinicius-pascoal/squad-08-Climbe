<template>
  <div class="progress-bar-container">
    <div class="progress-bar-label">Progresso</div>
    <div class="progress-bar-wrapper">
      <div 
        class="progress-bar" 
        :style="{ width: progress + '%' }"
      >
        <span class="progress-text">{{ progress }} %</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    // A propriedade "progress" receberá um número
    // O valor padrão é 0
    progress: {
      type: Number,
      required: true,
      default: 0,
      // Valida se o número está entre 0 e 100
      validator: (value) => {
        return value >= 0 && value <= 100;
      },
    },
  },
};
</script>

<style scoped>
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 15px; /* Espaço entre o rótulo e a barra */
  position: relative;
}

.progress-bar-label {
  font-weight: bold;
  font-size: 1rem;
  color: #333;
}

.progress-bar-wrapper {
  flex-grow: 1; /* Permite que a barra ocupe o espaço restante */
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  height: 25px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  width: 210px;
}

.progress-bar {
  background-color: #0E9A97; /* Cor verde/azulada da imagem */
  height: 100%;
  transition: width 0.4s ease; /* Adiciona uma transição suave */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px; /* Borda arredondada no lado direito */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
}

.progress-text {
  position:absolute;  
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
</style>