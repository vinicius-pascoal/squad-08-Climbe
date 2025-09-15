<script>
import PermissionCheckbox from "../components/PermissionCheckbox.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";

export default {
    components: {
        PermissionCheckbox,
        ToggleSwitch, // Register the new component here
    },
    data() {
        return {
            permissions: {
                criarPropostas: true,
                acessarCalendario: true,
                visualizarContratos: true,
                excluirUsuarios: false,
            },
        };
    },
};
</script>
<template>
    <div class="h-screen absolute top-0">
        <input type="search" placeholder="pesquisar"
            class="email shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-[#E1E5E5] rounded-lg px-4 py-2 w-[80vh] mt-4 mb-6 text-[#5F6060]" />
        <div class="flex justify-between items-center mb-8">

            <h1 class="font-bold text-[40px]"> Cadastro de usuário</h1>
            <div class="flex ">
                <input type="button" value="Salvar"
                    class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#C7D6FA] border border-[#4167C0] text-[#2B5DDF] text-[25px] rounded-lg mb-8 w-[151px] h-[39px] hover cursor-pointer ml-16"></input>
                <input type="button" value="Cancelar"
                    class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#F9CDCB] border border-[#B42839] text-[#B42839] text-[25px] rounded-lg mb-8 w-[151px] h-[39px] hover cursor-pointer ml-16"></input>
            </div>
        </div>
        <div
            class="h-fit w-full bg-[#FFFFFF] p-8 grid grid-cols-2 gap-8 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg">
            <div>
                <div class="gap-8">
                    <div class="flex flex-col  gap-1 mb-2">
                        <label for="nome" class=" font-bold text-[#5F6060]">Nome Completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Digite o nome completo"
                            class="border border-gray-300  w-[410px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                    </div>

                </div>
                <div>
                    <div class="flex flex-col gap-1 mb-2">
                        <label for="nome" class=" font-bold text-[#5F6060]">Cargo</label>
                        <select id="cargo" name="cargo"
                            class="border border-gray-300 w-[410px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2">
                            <option value="analista-marketing">Analista de Marketing</option>
                            <option value="gerente-vendas">Gerente de Vendas</option>
                            <option value="desenvolvedor-software">Desenvolvedor de Software</option>
                            <option value="designer-grafico">Designer Gráfico</option>
                        </select>
                    </div>

                </div>
                <div>
                    <div>
                        <div class="flex flex-col gap-1 mb-2">
                            <label for="nome" class=" font-bold text-[#5F6060]">Email corporativo</label>
                            <input type="email" id="nome" name="nome" placeholder="Digite o email"
                                class="border border-gray-300 w-[410px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>
                         <div class="flex flex-col gap-1 mb-2">
                            <label for="nome" class=" font-bold text-[#5F6060]">Senha</label>
                            <input type="password" id="nome" name="nome" placeholder="Digite a senha"
                                class="border border-gray-300 w-[410px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>

                    </div>
                </div>
                <div >
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div class="flex flex-col ">
                            <label for="nome" class=" font-bold text-[#5F6060]">Telefone</label>
                            <input type="text" id="nome" name="nome" placeholder="Digite o seu telefone"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>
                        <div class="flex flex-col ">
                            <label for="nome" class=" font-bold text-[#5F6060]">E-mail Adicional</label>
                            <input type="text" id="nome" name="nome" placeholder="Digite o seu email adicional"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>
                        <div class="flex flex-col ">
                            <label for="nome" class=" font-bold text-[#5F6060]">Departamento</label>
                            <select id="cargo" name="cargo"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2">
                                <option value="analista-marketing">Analista de Marketing</option>
                                <option value="gerente-vendas">Gerente de Vendas</option>
                                <option value="desenvolvedor-software">Desenvolvedor de Software</option>
                                <option value="designer-grafico">Designer Gráfico</option>
                            </select>
                        </div>
                        <div class="flex flex-col ">
                            <label for="nome" class=" font-bold text-[#5F6060]">Gestor responsável</label>
                            <input type="text" id="nome" name="nome" placeholder="Digite o seu gestor"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>

                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-8">
                <div class="flex h-fit w-full items-center justify-start gap-[20%]">
                    <img src="../icones/usuario.svg"
                        class="w-[15vh] h-[15vh] fotoperfil rounded-full border border-gray-300" />
                    <h1 class="w-700 text-bold text-[#5F6060] text-[24px]">John Lenon</h1>
                </div>
                <div>
                    <div class="flex flex-col ">
                        <label for="status" class=" font-bold text-[#5F6060]">Status</label>
                        <select id="status" name="status"
                            class="border border-gray-300 w-[410px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2">
                            <option value="ativo">Ativo</option>
                            <option value="pendente">Pendente</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
              <div class="p-8">
  <h2 class="text-xl font-bold mb-4 text-[#5F6060]">Permissões</h2>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <PermissionCheckbox
        id="criar-propostas"
        label="Criar Propostas"
        v-model="permissions.criarPropostas"
      />
    </div>
    <div>
      <PermissionCheckbox
        id="acessar-calendario"
        label="Acessar Calendário"
        v-model="permissions.acessarCalendario"
      />
    </div>
    <div>
      <PermissionCheckbox
        id="visualizar-contratos"
        label="Visualizar Contratos"
        v-model="permissions.visualizarContratos"
      />
    </div>
    <div>
      <PermissionCheckbox
        id="excluir-usuarios"
        label="Excluir Usuários/Empresas"
        v-model="permissions.excluirUsuarios"
      />
    </div>
  </div>
</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.email {
    background-image: url('/icones/pesquisa.svg');
    background-repeat: no-repeat;
    background-position: 15px center;
    padding-left: 45px;
}

.fotoperfil {
    background-image: url('../icones/usuario.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
</style>