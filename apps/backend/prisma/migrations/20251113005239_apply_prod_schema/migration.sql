-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_completo` VARCHAR(255) NOT NULL,
    `cargo_id` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `contato` VARCHAR(50) NULL,
    `situacao` VARCHAR(255) NULL,
    `senha_hash` CHAR(60) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    INDEX `usuarios_cargo_id_idx`(`cargo_id`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cargos` (
    `id_cargo` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_cargo` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `cargos_nome_cargo_key`(`nome_cargo`),
    PRIMARY KEY (`id_cargo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissoes` (
    `id_permissao` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_permissao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_permissoes` (
    `usuarioId` INTEGER NOT NULL,
    `permissaoId` INTEGER NOT NULL,

    INDEX `usuario_permissoes_usuarioId_idx`(`usuarioId`),
    INDEX `usuario_permissoes_permissaoId_idx`(`permissaoId`),
    PRIMARY KEY (`usuarioId`, `permissaoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cargo_permissoes` (
    `id_cargo` INTEGER NOT NULL,
    `id_permissao` INTEGER NOT NULL,

    INDEX `cargo_permissoes_id_permissao_idx`(`id_permissao`),
    PRIMARY KEY (`id_cargo`, `id_permissao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id_empresa` INTEGER NOT NULL AUTO_INCREMENT,
    `razao_social` VARCHAR(255) NOT NULL,
    `nome_fantasia` VARCHAR(255) NULL,
    `cnpj` CHAR(18) NOT NULL,
    `logradouro` VARCHAR(255) NULL,
    `numero` VARCHAR(255) NULL,
    `bairro` VARCHAR(255) NULL,
    `cidade` VARCHAR(255) NULL,
    `uf` VARCHAR(255) NULL,
    `cep` VARCHAR(255) NULL,
    `telefone` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `representante_cpf` CHAR(14) NULL,
    `representante_contato` VARCHAR(50) NULL,

    PRIMARY KEY (`id_empresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicos` (
    `id_servico` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_servico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa_servico` (
    `id_empresa` INTEGER NOT NULL,
    `id_servico` INTEGER NOT NULL,

    INDEX `empresa_servico_id_servico_idx`(`id_servico`),
    PRIMARY KEY (`id_empresa`, `id_servico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propostas` (
    `id_proposta` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `status` VARCHAR(255) NULL,
    `data_criacao` DATETIME(3) NOT NULL,

    INDEX `propostas_empresa_id_idx`(`empresa_id`),
    INDEX `propostas_usuario_id_idx`(`usuario_id`),
    PRIMARY KEY (`id_proposta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contratos` (
    `id_contrato` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `id_proposta` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NULL,
    `valor` DOUBLE NOT NULL,
    `dataInicio` DATETIME(3) NOT NULL,
    `dataFim` DATETIME(3) NOT NULL,
    `envolvidos` VARCHAR(191) NULL,
    `acoes` VARCHAR(191) NULL,
    `permissoes` VARCHAR(191) NULL,

    INDEX `contratos_id_proposta_idx`(`id_proposta`),
    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planilhas` (
    `id_planilha` INTEGER NOT NULL AUTO_INCREMENT,
    `id_contrato` VARCHAR(191) NOT NULL,
    `url_google_sheets` VARCHAR(255) NULL,
    `bloqueada` BOOLEAN NULL,
    `permissao_visualizacao` VARCHAR(255) NULL,

    INDEX `planilhas_id_contrato_idx`(`id_contrato`),
    PRIMARY KEY (`id_planilha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorios` (
    `id_relatorio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_contrato` VARCHAR(191) NOT NULL,
    `url_pdf` VARCHAR(255) NULL,
    `data_envio` DATETIME(3) NULL,

    INDEX `relatorios_id_contrato_idx`(`id_contrato`),
    PRIMARY KEY (`id_relatorio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reunioes` (
    `id_reuniao` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NULL,
    `empresa_id` INTEGER NOT NULL,
    `data` DATE NOT NULL,
    `hora` TIME(0) NOT NULL,
    `presencial` BOOLEAN NULL,
    `local` VARCHAR(255) NULL,
    `pauta` TEXT NULL,
    `status` VARCHAR(255) NULL,

    INDEX `reunioes_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id_reuniao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participantes_reuniao` (
    `id_reuniao` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,

    INDEX `participantes_reuniao_id_usuario_idx`(`id_usuario`),
    PRIMARY KEY (`id_reuniao`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacoes` (
    `id_notificacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `mensagem` VARCHAR(255) NULL,
    `data_envio` DATETIME(3) NULL,
    `tipo` VARCHAR(255) NULL,

    INDEX `notificacoes_id_usuario_idx`(`id_usuario`),
    PRIMARY KEY (`id_notificacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id_documento` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `tipo_documento` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `validado` VARCHAR(255) NULL,
    `analista_id` INTEGER NULL,

    INDEX `documentos_empresa_id_idx`(`empresa_id`),
    INDEX `documentos_analista_id_idx`(`analista_id`),
    PRIMARY KEY (`id_documento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarefas` (
    `id_tarefa` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'A_FAZER',
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` INTEGER NULL,
    `categoria` ENUM('DESENVOLVIMENTO', 'DOCUMENTACAO', 'MARKETING', 'VENDAS', 'UI_DESIGN') NULL,
    `proposta_id` INTEGER NULL,

    INDEX `tarefas_usuario_id_idx`(`usuario_id`),
    INDEX `tarefas_proposta_id_idx`(`proposta_id`),
    PRIMARY KEY (`id_tarefa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditorias` (
    `id_auditoria` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NULL,
    `acao` VARCHAR(255) NOT NULL,
    `entidade` VARCHAR(100) NOT NULL,
    `entidade_id` INTEGER NULL,
    `descricao` TEXT NULL,
    `ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `dados_antes` TEXT NULL,
    `dados_depois` TEXT NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `auditorias_usuario_id_idx`(`usuario_id`),
    INDEX `auditorias_entidade_idx`(`entidade`),
    INDEX `auditorias_data_criacao_idx`(`data_criacao`),
    PRIMARY KEY (`id_auditoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fluxos_contrato` (
    `id_fluxo` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,
    `empresa_id` INTEGER NULL,
    `iniciador_id` INTEGER NOT NULL,
    `status` VARCHAR(50) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `proposta_id` INTEGER NULL,
    `contrato_id` VARCHAR(191) NULL,

    INDEX `fluxos_contrato_empresa_id_idx`(`empresa_id`),
    INDEX `fluxos_contrato_iniciador_id_idx`(`iniciador_id`),
    INDEX `fluxos_contrato_proposta_id_idx`(`proposta_id`),
    INDEX `fluxos_contrato_contrato_id_idx`(`contrato_id`),
    PRIMARY KEY (`id_fluxo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fluxo_etapas` (
    `id_fluxo_step` INTEGER NOT NULL AUTO_INCREMENT,
    `id_fluxo` INTEGER NOT NULL,
    `tipo` ENUM('REUNIAO', 'PROPOSTA', 'CONTRATO', 'CRIACAO_EMPRESA') NOT NULL,
    `status` VARCHAR(50) NULL,
    `agendado_em` DATETIME(3) NULL,
    `concluido_em` DATETIME(3) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fluxo_etapas_id_fluxo_idx`(`id_fluxo`),
    INDEX `fluxo_etapas_tipo_idx`(`tipo`),
    PRIMARY KEY (`id_fluxo_step`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fluxo_participantes` (
    `id_fluxo` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `role` VARCHAR(50) NULL,

    INDEX `fluxo_participantes_id_usuario_idx`(`id_usuario`),
    PRIMARY KEY (`id_fluxo`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_cargo_id_fkey` FOREIGN KEY (`cargo_id`) REFERENCES `cargos`(`id_cargo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_permissoes` ADD CONSTRAINT `usuario_permissoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_permissoes` ADD CONSTRAINT `usuario_permissoes_permissaoId_fkey` FOREIGN KEY (`permissaoId`) REFERENCES `permissoes`(`id_permissao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cargo_permissoes` ADD CONSTRAINT `cargo_permissoes_id_cargo_fkey` FOREIGN KEY (`id_cargo`) REFERENCES `cargos`(`id_cargo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cargo_permissoes` ADD CONSTRAINT `cargo_permissoes_id_permissao_fkey` FOREIGN KEY (`id_permissao`) REFERENCES `permissoes`(`id_permissao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresa_servico` ADD CONSTRAINT `empresa_servico_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresa_servico` ADD CONSTRAINT `empresa_servico_id_servico_fkey` FOREIGN KEY (`id_servico`) REFERENCES `servicos`(`id_servico`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contratos` ADD CONSTRAINT `contratos_id_proposta_fkey` FOREIGN KEY (`id_proposta`) REFERENCES `propostas`(`id_proposta`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planilhas` ADD CONSTRAINT `planilhas_id_contrato_fkey` FOREIGN KEY (`id_contrato`) REFERENCES `contratos`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_id_contrato_fkey` FOREIGN KEY (`id_contrato`) REFERENCES `contratos`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_reuniao_fkey` FOREIGN KEY (`id_reuniao`) REFERENCES `reunioes`(`id_reuniao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_analista_id_fkey` FOREIGN KEY (`analista_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `tarefas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `tarefas_proposta_id_fkey` FOREIGN KEY (`proposta_id`) REFERENCES `propostas`(`id_proposta`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditorias` ADD CONSTRAINT `auditorias_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxos_contrato` ADD CONSTRAINT `fluxos_contrato_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxos_contrato` ADD CONSTRAINT `fluxos_contrato_iniciador_id_fkey` FOREIGN KEY (`iniciador_id`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxos_contrato` ADD CONSTRAINT `fluxos_contrato_proposta_id_fkey` FOREIGN KEY (`proposta_id`) REFERENCES `propostas`(`id_proposta`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxos_contrato` ADD CONSTRAINT `fluxos_contrato_contrato_id_fkey` FOREIGN KEY (`contrato_id`) REFERENCES `contratos`(`id_contrato`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxo_etapas` ADD CONSTRAINT `fluxo_etapas_id_fluxo_fkey` FOREIGN KEY (`id_fluxo`) REFERENCES `fluxos_contrato`(`id_fluxo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxo_participantes` ADD CONSTRAINT `fluxo_participantes_id_fluxo_fkey` FOREIGN KEY (`id_fluxo`) REFERENCES `fluxos_contrato`(`id_fluxo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fluxo_participantes` ADD CONSTRAINT `fluxo_participantes_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
