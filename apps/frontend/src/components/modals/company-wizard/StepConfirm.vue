<template>
  <div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2">
      <Card title="Informações Básicas">
        <dl class="grid grid-cols-[140px,1fr] gap-y-2 text-sm">
          <dt class="muted">Nome</dt>           <dd class="truncate">{{ form.basic.name }}</dd>
          <dt class="muted">CNPJ</dt>           <dd>{{ form.basic.cnpj }}</dd>
          <dt class="muted">Telefone</dt>       <dd>{{ form.basic.phone }}</dd>
          <dt class="muted">Razão Social</dt>   <dd class="truncate">{{ form.basic.corporateName }}</dd>
          <dt class="muted">Email</dt>          <dd class="truncate">{{ form.basic.email }}</dd>
        </dl>
      </Card>

      <Card title="Endereço">
        <dl class="grid grid-cols-[140px,1fr] gap-y-2 text-sm">
          <dt class="muted">Logradouro</dt>   <dd class="truncate">{{ form.address.street }}</dd>
          <dt class="muted">Número</dt>       <dd>{{ form.address.number }}</dd>
          <dt class="muted">Bairro</dt>       <dd>{{ form.address.neighborhood }}</dd>
          <dt class="muted">Cidade</dt>       <dd>{{ form.address.city }}</dd>
          <dt class="muted">UF</dt>           <dd>{{ form.address.state }}</dd>
          <dt class="muted">CEP</dt>          <dd>{{ form.address.zip }}</dd>
        </dl>
      </Card>

      <Card title="Representante Legal">
        <dl class="grid grid-cols-[140px,1fr] gap-y-2 text-sm">
          <dt class="muted">Nome</dt>       <dd class="truncate">{{ form.representative.name }}</dd>
          <dt class="muted">CPF</dt>        <dd>{{ form.representative.cpf }}</dd>
          <dt class="muted">RG</dt>         <dd>{{ form.representative.rg }}</dd>
          <dt class="muted">E-mail</dt>     <dd class="truncate">{{ form.representative.email }}</dd>
          <dt class="muted">Telefone</dt>   <dd>{{ form.representative.phone1 }}</dd>
          <dt class="muted">Telefone</dt>   <dd>{{ form.representative.phone2 }}</dd>
        </dl>
      </Card>

      <Card title="Informações Adicionais">
        <dl class="grid grid-cols-[140px,1fr] gap-y-2 text-sm">
          <dt class="muted">Porte</dt>      <dd>{{ form.extra.companySize }}</dd>
          <dt class="muted">Área</dt>       <dd>{{ form.extra.area }}</dd>
          <dt class="muted">Documentos</dt> <dd>{{ form.extra.files.length }} arquivo(s)</dd>
        </dl>
      </Card>
    </div>
    <p class="text-center text-xs text-slate-500">Revise os dados antes de salvar.</p>
  </div>
</template>

<script setup lang="ts">
import Card from './_Card.vue'
defineProps<{ form: any }>()
</script>

<style scoped>
.muted { @apply text-slate-500; }
</style>