<template>
  <div class="signature-box">
    <div class="content-area">
      </div>
    
    <div class="dashed-line"></div>
  </div>
</template>

<script>
export default {
  name: 'SignatureBox',
};
</script>

<style scoped>
.signature-box {
  width: 346px;
  height: 129px; /* Ajuste a altura conforme necessário */
  background-color: #fff;
  border-radius: 8px; /* Borda arredondada */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
  position: relative;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex-grow: 1; /* Ocupa todo o espaço disponível */
  padding: 16px;
  /* Você pode adicionar estilos como um campo de texto aqui */
}

.dashed-line {
  height: 1px;
  margin: 0 16px; /* Espaço nas laterais para que a linha não toque as bordas */
  border-bottom: 2px dashed #d9d9d9; /* Cor e estilo da linha tracejada */
}
</style>