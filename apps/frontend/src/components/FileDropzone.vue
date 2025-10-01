<template>
  <div class="dropzone-box">
    <div class="dropzone-content">
      <p class="text-center text-gray-600">
        Arraste<br>ou<br>Carregue
      </p>
      
      <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden">
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileDropzone',
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log('Arquivo carregado:', file.name);
        // Aqui você pode emitir um evento para o componente pai com o arquivo
        this.$emit('file-uploaded', file);
      }
    }
  }
};
</script>

<style scoped>
.dropzone-box {
  width: 353px;
  min-height: 147px;
  background-color: #f0f4ff; /* Cor azul claro */
  border: 2px dashed #93b3e2; /* Borda tracejada azul */
  border-radius: 8px; /* Borda arredondada */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropzone-box:hover {
  background-color: #e3ecff; /* Cor mais clara no hover */
}

.dropzone-content {
  padding: 2rem;
}
</style>