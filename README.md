# Climbe

Uma aplicação web full-stack moderna construída com Vue.js, Express.js e MySQL, projetada para gestão empresarial e relacionamento com clientes.

## 🚀 Visão Geral do Projeto

Climbe é uma plataforma abrangente de gestão empresarial que oferece:

- **Gestão de Usuários**: Sistema completo de autenticação e autorização com permissões baseadas em funções
- **Gestão de Empresas**: Perfis completos de empresas com informações de contato e rastreamento de serviços
- **Sistema de Propostas**: Criar, gerenciar e acompanhar propostas comerciais
- **Gestão de Contratos**: Gerenciar contratos com relatórios integrados e gestão de planilhas
- **Agendador de Reuniões**: Agendar e gerenciar reuniões com participantes e acompanhamento de pautas
- **Gestão de Documentos**: Fazer upload, validar e gerenciar documentos de empresas
- **Sistema de Notificações**: Notificações em tempo real para usuários
- **Relatórios**: Gerar e gerenciar relatórios em PDF para contratos

### Stack Tecnológica

**Frontend:**

- Vue.js 3 com TypeScript
- Vue Router para navegação
- Tailwind CSS para estilização
- Vite para ferramentas de build

**Backend:**

- Node.js com Express.js
- TypeScript para segurança de tipos
- Prisma ORM para gestão de banco de dados
- Banco de dados MySQL 8.0

**Infraestrutura:**

- Docker & Docker Compose para containerização
- Turbo para gestão de monorepo
- Builds Docker multi-estágio para otimização de produção

## 📋 Pré-requisitos

Antes de executar este projeto, certifique-se de ter instalado:

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)
- [Node.js](https://nodejs.org/) (versão 22 ou superior) - apenas se executar sem Docker

## 🛠️ Configuração de Desenvolvimento

### Início Rápido

1. **Clone o repositório:**

   ```bash
   git clone <repository-url>
   cd climbe-turbo-fixed-v2
   ```

2. **Configure as variáveis de ambiente:**

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas credenciais de banco de dados preferidas, se necessário.

3. **Inicie o ambiente de desenvolvimento:**

   ```bash
   docker compose --profile dev up -d
   ```

4. **Acesse a aplicação:**
   - Frontend: http://localhost:5173
   - API Backend: http://localhost:3000/api/health
   - Banco de dados: localhost:3306

### Fluxo de Desenvolvimento

A configuração de desenvolvimento inclui:

- **Hot reload** para frontend e backend
- **Migrações automáticas do banco de dados** na inicialização
- **Monitoramento de arquivos** com polling para compatibilidade multiplataforma
- **Geração do Prisma Client** e sincronização do banco de dados

### Scripts Auxiliares de Desenvolvimento

Para conveniência, fornecemos scripts auxiliares para gerenciar tarefas comuns de desenvolvimento:

```bash
# Iniciar ambiente de desenvolvimento
./scripts/dev.sh start

# Visualizar logs da aplicação
./scripts/dev.sh logs

# Executar migração do banco de dados
./scripts/dev.sh migrate add_new_feature

# Abrir shell da aplicação
./scripts/dev.sh shell

# Verificar saúde dos serviços
./scripts/health-check.sh

# Ver todos os comandos disponíveis
./scripts/dev.sh help
```

### Parando o Ambiente de Desenvolvimento

```bash
docker compose --profile dev down
```

Para também remover volumes (dados do banco):

```bash
docker compose --profile dev down -v
```

## 🗄️ Gestão do Banco de Dados

### Migrações do Banco de Dados

O projeto usa Prisma para gestão do banco de dados. Aqui estão os comandos essenciais:

#### Executando Migrações em Desenvolvimento

```bash
# Aplicar migrações pendentes
docker compose --profile dev exec app-dev \
  npx prisma migrate dev --schema apps/backend/prisma/schema.prisma --name <nome-da-migracao>

# Resetar banco de dados (ATENÇÃO: Isso irá deletar todos os dados)
docker compose --profile dev exec app-dev \
  npx prisma migrate reset --schema apps/backend/prisma/schema.prisma
```

## 🚀 Deploy de Produção

### Construindo e Executando em Produção

1. **Certifique-se de que as variáveis de ambiente estão configuradas:**

   ```bash
   cp .env.example .env
   # Edite .env com valores de produção
   ```

2. **Construa e inicie os containers de produção:**

   ```bash
   docker compose --profile prod up -d --build
   ```

3. **Verifique o deploy:**
   - Aplicação: http://localhost:3000
   - Verificação de saúde: http://localhost:3000/api/health

### Detalhes do Ambiente de Produção

A configuração de produção inclui:

- **Build Docker multi-estágio** para tamanho de imagem otimizado
- **Migrações automáticas do banco de dados** na inicialização
- **Servir arquivos estáticos** do servidor Express
- **Build otimizado para produção** do Vue.js

### Comandos de Produção

```bash
# Visualizar logs
docker compose --profile prod logs -f

# Parar ambiente de produção
docker compose --profile prod down

# Reconstruir e reiniciar
docker compose --profile prod up -d --build --force-recreate
```

## 📁 Estrutura do Projeto

```
climbe-turbo-fixed-v2/
├── apps/
│   ├── backend/                 # Servidor API Express.js
│   │   ├── src/
│   │   │   └── index.ts        # Arquivo principal do servidor
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Schema do banco de dados
│   │   └── package.json
│   └── frontend/               # Aplicação Vue.js
│       ├── src/
│       │   ├── views/          # Componentes/páginas Vue
│       │   ├── router/         # Configuração do Vue Router
│       │   └── main.ts         # Ponto de entrada da aplicação
│       └── package.json
├── docker-compose.yml          # Configuração dos serviços Docker
├── Dockerfile                  # Imagem Docker de produção
├── turbo.json                  # Configuração do monorepo Turbo
└── package.json               # Configuração do pacote raiz
```

## 🔍 Scripts Disponíveis

### Scripts do Nível Raiz

```bash
npm run dev      # Iniciar frontend e backend em desenvolvimento
npm run build    # Construir ambas aplicações para produção
npm run lint     # Executar linting em todos os pacotes
npm run format   # Formatar código em todos os pacotes
```

### Scripts do Backend

```bash
cd apps/backend
npm run dev      # Iniciar backend em modo desenvolvimento
npm run build    # Construir backend para produção
npm run start    # Iniciar backend de produção
```

### Scripts do Frontend

```bash
cd apps/frontend
npm run dev      # Iniciar servidor de desenvolvimento do frontend
npm run build    # Construir frontend para produção
npm run typecheck # Executar verificação de tipos TypeScript
```

## 📡 Endpoints da API

### 🔐 Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/auth/token` | Login com email/senha | ❌ Público |
| `POST` | `/api/auth/google` | Login com Google OAuth | ❌ Público |

### 👤 Usuários (`/api/usuarios`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/usuarios/register` | Registro de novo usuário | ❌ Público |
| `POST` | `/api/usuarios/admin` | Criar usuário como admin | ✅ Requerida |
| `PATCH` | `/api/usuarios/:id/aprovar` | Aprovar usuário pendente | ✅ Requerida |
| `GET` | `/api/usuarios` | Listar todos os usuários | ✅ Requerida |
| `GET` | `/api/usuarios/:id` | Buscar usuário por ID | ✅ Requerida |
| `DELETE` | `/api/usuarios/:id` | Remover usuário | ✅ Requerida |

### 💼 Cargos (`/api/cargos`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/cargos` | Listar todos os cargos | ❌ Público |

### 📧 Email (`/api/emails`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/emails/send` | Enviar email | ✅ Requerida |

### 📄 Contratos (`/api/contratos`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/contratos` | Listar todos os contratos | ✅ Requerida |
| `POST` | `/api/contratos/register` | Criar novo contrato | ✅ Requerida |
| `GET` | `/api/contratos/:id` | Buscar contrato por ID | ✅ Requerida |

### 🏢 Empresas (`/api/empresas`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/empresas` | Criar nova empresa | ✅ Requerida |
| `GET` | `/api/empresas` | Listar todas as empresas | ✅ Requerida |
| `GET` | `/api/empresas/:id` | Buscar empresa por ID | ✅ Requerida |
| `PUT` | `/api/empresas/:id` | Atualizar empresa | ✅ Requerida |
| `DELETE` | `/api/empresas/:id` | Remover empresa | ✅ Requerida |

### ✅ Tarefas (`/api/tarefas`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/tarefas` | Criar nova tarefa | ✅ Requerida |
| `GET` | `/api/tarefas` | Listar todas as tarefas | ✅ Requerida |
| `GET` | `/api/tarefas/:id` | Buscar tarefa por ID | ✅ Requerida |
| `PUT` | `/api/tarefas/:id` | Atualizar tarefa | ✅ Requerida |
| `DELETE` | `/api/tarefas/:id` | Remover tarefa | ✅ Requerida |

### 📅 Eventos/Reuniões (`/api/events`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/events/create` | Criar evento no Google Calendar | ✅ + Google Token |
| `GET` | `/api/events` | Listar eventos do Google Calendar | ✅ + Google Token |
| `GET` | `/api/events/user` | Listar eventos do usuário (local + Google) | ✅ Requerida |

**Notas:**
- Endpoints com ✅ requerem token JWT no header: `Authorization: Bearer <token>`
- Endpoints de eventos requerem token do Google no header: `x-google-access-token: <token>`
- Endpoint `/api/events` aceita query opcional: `?date=YYYY-MM-DD`

### 🗂️ Drive (`/api/drive`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/drive/create` | Criar/registrar recurso no Drive | ✅ Requerida |
| `PUT` | `/api/drive/:id` | Atualizar recurso no Drive | ✅ Requerida |
| `GET` | `/api/drive/:id` | Buscar recurso do Drive por ID | ✅ Requerida |

### 📑 Propostas (`/api/propostas`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/propostas` | Criar nova proposta | ✅ Requerida |
| `GET` | `/api/propostas` | Listar todas as propostas | ✅ Requerida |
| `GET` | `/api/propostas/empresa/:empresaId` | Listar propostas por empresa | ✅ Requerida |
| `GET` | `/api/propostas/usuario/:usuarioId` | Listar propostas por usuário | ✅ Requerida |
| `GET` | `/api/propostas/:id/historico` | Histórico de alterações da proposta | ✅ Requerida |
| `GET` | `/api/propostas/:id` | Buscar proposta por ID | ✅ Requerida |
| `PUT` | `/api/propostas/:id` | Atualizar proposta | ✅ Requerida |
| `DELETE` | `/api/propostas/:id` | Deletar proposta | ✅ Requerida |

> Permissões: Criar — "Propostas Comerciais — Criar"; Atualizar/Deletar — "Propostas Comerciais — Validar".

### 🧭 Auditorias (`/api/auditorias`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/auditorias/export/excel` | Exportar auditorias em Excel | ✅ Requerida |
| `GET` | `/api/auditorias/export/csv` | Exportar auditorias em CSV | ✅ Requerida |
| `GET` | `/api/auditorias/entidade/:entidade` | Listar por entidade | ✅ Requerida |
| `GET` | `/api/auditorias` | Listar auditorias (com filtros) | ✅ Requerida |
| `GET` | `/api/auditorias/:id` | Buscar auditoria por ID | ✅ Requerida |
| `POST` | `/api/auditorias` | Criar registro de auditoria | ✅ Requerida |

### 🙋 Me (Usuário atual) (`/api/me`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/me` | Dados do usuário logado e permissões | ✅ Requerida |

### 🏥 Health Check

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/health` | Verificar status da API | ❌ Público |

Para ajuda adicional ou dúvidas, por favor abra uma issue no repositório.
