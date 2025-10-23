<script>
import PermissionCheckbox from "../components/PermissionCheckbox.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import { http } from "../lib/http";

export default {
    components: {
        PermissionCheckbox,
        ToggleSwitch,
    },
    data() {
        return {
            form: {
                nomeCompleto: "",
                email: "",
                senha: "",
                contato: "",
                cargoId: "",
            },

            statusSelecionado: "pendente",

            cargos: [],

            permissions: {
                criarPropostas: true,
                acessarCalendario: true,
                visualizarContratos: true,
                excluirUsuarios: false,
            },

            loading: false,
        };
    },
    methods: {
        mapStatusToSituacao(status) {
            const s = String(status).toLowerCase();
            if (s === "ativo") return "aprovado";
            if (s === "pendente") return "pendente";
            return "inativo";
        },

        async carregarCargos() {
            try {
                const data = await http("/api/cargos");
                this.cargos = Array.isArray(data) ? data : [];
            } catch (e) {
                console.warn("Falha ao carregar cargos:", e?.message || e);
                this.cargos = [];
            }
        },

        async salvar() {
            try {
                if (!this.form.nomeCompleto || !this.form.email || !this.form.senha || !this.form.cargoId) {
                    this.$notify?.warning("Preencha nome, email, senha e cargo.");
                    return;
                }

                this.loading = true;

                const payload = {
                    nomeCompleto: this.form.nomeCompleto.trim(),
                    email: this.form.email.trim(),
                    contato: this.form.contato?.trim() || null,
                    senha: this.form.senha,
                    cargoId: Number(this.form.cargoId),
                    situacao: this.mapStatusToSituacao(this.statusSelecionado),
                };

                await http("/api/usuarios/admin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                this.$notify?.success("Usuário criado com sucesso!");
                this.$router.push("/usuarios");
            } catch (e) {
                console.error(e);
                this.$notify?.error(e?.message || "Falha ao criar usuário.");
            } finally {
                this.loading = false;
            }
        },

        cancelar() {
            this.$router.push("/usuarios");
        },
    },
    mounted() {
        this.carregarCargos();
    },
};
</script>

<template>
    <div class="">
        <div class="flex justify-between items-center my-4">
            <h1 class="font-bold text-[40px]"> Cadastro de usuário</h1>
            <div class="flex ">
                <input type="button" value="Salvar" @click="salvar" :disabled="loading"
                    class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-c7d6fa border border-brand-4167c0 text-brand-2b5ddf text-[25px] rounded-lg mb-8 w-[151px] h-[39px] hover cursor-pointer ml-16" />
                <input type="button" value="Cancelar" @click="cancelar"
                    class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-f9cdcb border border-brand-b42839 text-brand-b42839 text-[25px] rounded-lg mb-8 w-[151px] h-[39px] hover cursor-pointer ml-16" />
            </div>
        </div>

        <div
            class="h-full mx-10 bg-brand-ffffff p-8 grid grid-cols-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg ">
            <div class="flex flex-col gap-8">
                <div class="gap-8">
                    <div class="flex flex-col gap-1 mb-2">
                        <label for="nome" class=" font-bold text-brand-5f6060">Nome Completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Digite o nome completo"
                            v-model="form.nomeCompleto"
                            class="border border-gray-300  w-5/6  h-[37px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                    </div>
                </div>

                <div>
                    <div class="flex flex-col gap-1 mb-2">
                        <label for="cargo" class=" font-bold text-brand-5f6060">Cargo</label>
                        <select id="cargo" name="cargo" v-model="form.cargoId"
                            class="border border-gray-300 w-5/6  h-[37px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2">
                            <option value="" disabled>Selecione o cargo</option>

                            <option v-for="c in cargos" :key="c.id" :value="c.id">
                                {{ c.nomeCargo }}
                            </option>

                            <option disabled v-if="!cargos.length" value="analista-marketing">Analista de Marketing
                            </option>
                            <option disabled v-if="!cargos.length" value="gerente-vendas">Gerente de Vendas</option>
                            <option disabled v-if="!cargos.length" value="desenvolvedor-software">Desenvolvedor de
                                Software</option>
                            <option disabled v-if="!cargos.length" value="designer-grafico">Designer Gráfico</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col gap-1 mb-2">
                    <label for="email_corp" class=" font-bold text-brand-5f6060">Email corporativo</label>
                    <input type="email" id="email_corp" name="email_corp" placeholder="Digite o email"
                        v-model="form.email"
                        class="border border-gray-300 w-5/6 h-[37px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                </div>

                <div class="flex flex-col gap-1 mb-2">
                    <label for="senha" class=" font-bold text-brand-5f6060">Senha</label>
                    <input type="password" id="senha" name="senha" placeholder="Digite a senha" v-model="form.senha"
                        class="border border-gray-300 w-5/6  h-[37px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                </div>

                <div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div class="flex flex-col ">
                            <label for="telefone" class=" font-bold text-brand-5f6060">Telefone</label>
                            <input type="text" id="telefone" name="telefone" placeholder="Digite o seu telefone"
                                v-model="form.contato"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>

                        <div class="flex flex-col ">
                            <label for="email_adicional" class=" font-bold text-brand-5f6060">E-mail Adicional</label>
                            <input type="text" id="email_adicional" name="email_adicional"
                                placeholder="Digite o seu email adicional"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>

                        <div class="flex flex-col ">
                            <label for="departamento" class=" font-bold text-brand-5f6060">Departamento</label>
                            <select id="departamento" name="departamento"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2">
                                <option value="analista-marketing">Analista de Marketing</option>
                                <option value="gerente-vendas">Gerente de Vendas</option>
                                <option value="desenvolvedor-software">Desenvolvedor de Software</option>
                                <option value="designer-grafico">Designer Gráfico</option>
                            </select>
                        </div>

                        <div class="flex flex-col ">
                            <label for="gestor" class=" font-bold text-brand-5f6060">Gestor responsável</label>
                            <input type="text" id="gestor" name="gestor" placeholder="Digite o seu gestor"
                                class="border border-gray-300 w-[178px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-10">
                <div class="flex h-fit w-full items-center justify-start">
                    <img src="../icones/usuario.svg"
                        class="w-[15vh] h-[15vh] fotoperfil rounded-full border border-gray-300" />
                    <h1 class="w-700 text-bold text-brand-5f6060 text-[24px] ml-3">John Lenon</h1>
                </div>

                <div>
                    <div class="flex flex-col ">
                        <label for="status" class=" font-bold text-brand-5f6060">Status</label>
                        <select id="status" name="status" v-model="statusSelecionado"
                            class="border border-gray-300 w-[410px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-lg px-2">
                            <option value="ativo">Ativo</option>
                            <option value="pendente">Pendente</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <div class="p-8 mt-40">
                        <h2 class="text-xl font-bold mb-4 text-brand-5f6060">Permissões</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <PermissionCheckbox id="criar-propostas" label="Criar Propostas"
                                    v-model="permissions.criarPropostas" />
                            </div>
                            <div>
                                <PermissionCheckbox id="acessar-calendario" label="Acessar Calendário"
                                    v-model="permissions.acessarCalendario" />
                            </div>
                            <div>
                                <PermissionCheckbox id="visualizar-contratos" label="Visualizar Contratos"
                                    v-model="permissions.visualizarContratos" />
                            </div>
                            <div>
                                <PermissionCheckbox id="excluir-usuarios" label="Excluir Usuários/Empresas"
                                    v-model="permissions.excluirUsuarios" />
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
