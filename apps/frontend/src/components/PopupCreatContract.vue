<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Criar Novo Contrato</h2>
        <button @click="$emit('close')" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <p class="modal-description">Comece criando seu contrato selecionando o tipo mais relevante</p>
      
      <div class="options-container">
        <div class="option-card">
          <img src="/icones/contratobranco.svg" alt="Contrato em branco" class="option-icon" />
          <h3 class="option-title">Contrato em branco</h3>
          <p class="option-description">Crie em um template <br> Em branco</p>
          <div class="radio-button"></div>
        </div>
        
        <div class="option-card">
          <img src="/icones/importamodelo.svg" alt="Importe modelo" class="option-icon" />
          <h3 class="option-title">Importe um Modelo</h3>
          <p class="option-description">Importar modelo já <br> Existente</p>
          <div class="radio-button"></div>
        </div>

        <router-link to="/NovoContrato" class="option-card">
          <img src="/icones/modelopronto.svg" alt="Contractor" class="option-icon" />
          <h3 class="option-title">Contractor</h3>
          <p class="option-description">Use modelo pronto</p>
          <div class="radio-button"></div>
        </router-link>
      </div>
      
      <button class="confirm-btn  border border-[#3B67D0] bg-[#CAD8FD] text-[#2551B2] rounded-lg">Confirmar</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
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
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
  text-align: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.modal-description {
  color: #5F6060;
  margin-bottom: 2rem;
}

.options-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.option-card {
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  /* Add these styles to make the router-link look like a card */
  text-decoration: none;
  color: inherit;
}

.option-icon {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.option-title {
  font-weight: bold;
}

.option-description {
  font-size: 0.875rem;
  color: #5F6060;
  text-align: center;
  margin-top: 0.5rem;
}

.radio-button {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  margin-top: 1rem;
}

.confirm-btn {
  background-color: #3B67D0;
  color: white;
  padding: 0.75rem 2.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}
</style>