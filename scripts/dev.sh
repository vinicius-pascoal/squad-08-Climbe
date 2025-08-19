#!/bin/bash

# =============================================================================
# SCRIPT AUXILIAR DE DESENVOLVIMENTO CLIMBE
# =============================================================================
# Este script fornece comandos convenientes para tarefas comuns de desenvolvimento
# Uso: ./scripts/dev.sh <comando>
# =============================================================================

set -e

# Cores para saída
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

# Funções auxiliares
print_header() {
    echo -e "${BLUE}==============================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se o Docker está executando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está executando. Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
}

# Comandos principais
case "$1" in
    "start"|"up")
        print_header "Iniciando Ambiente de Desenvolvimento"
        check_docker
        docker compose --profile dev up -d
        print_success "Ambiente de desenvolvimento iniciado!"
        print_info "Frontend: http://localhost:5173"
        print_info "Backend: http://localhost:3000/api/health"
        print_info "Banco de dados: localhost:3306"
        ;;

    "stop"|"down")
        print_header "Parando Ambiente de Desenvolvimento"
        docker compose --profile dev down
        print_success "Ambiente de desenvolvimento parado!"
        ;;

    "restart")
        print_header "Reiniciando Ambiente de Desenvolvimento"
        check_docker
        docker compose --profile dev down
        docker compose --profile dev up -d
        print_success "Ambiente de desenvolvimento reiniciado!"
        ;;

    "logs")
        print_header "Visualizando Logs da Aplicação"
        docker compose --profile dev logs -f app-dev
        ;;

    "db-logs")
        print_header "Visualizando Logs do Banco de Dados"
        docker compose --profile dev logs -f db
        ;;

    "shell")
        print_header "Abrindo Shell no Container de Desenvolvimento"
        docker compose --profile dev exec app-dev bash
        ;;

    "db-shell")
        print_header "Abrindo Shell MySQL"
        docker compose --profile dev exec db mysql -u app -papp appdb
        ;;

    "migrate")
        print_header "Executando Migração do Banco de Dados"
        if [ -z "$2" ]; then
            print_error "Por favor, forneça um nome para a migração: ./scripts/dev.sh migrate <nome>"
            exit 1
        fi
        docker compose --profile dev exec app-dev \
            npx prisma migrate dev --schema apps/backend/prisma/schema.prisma --name "$2"
        print_success "Migração '$2' concluída!"
        ;;

    "migrate-reset")
        print_header "Resetando Banco de Dados (ATENÇÃO: Isso irá deletar todos os dados!)"
        print_warning "Isso irá deletar todos os dados no banco de dados!"
        read -p "Tem certeza? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            docker compose --profile dev exec app-dev \
                npx prisma migrate reset --schema apps/backend/prisma/schema.prisma --force
            print_success "Reset do banco de dados concluído!"
        else
            print_info "Reset do banco de dados cancelado."
        fi
        ;;

    "db-push")
        print_header "Enviando Mudanças do Schema para o Banco"
        docker compose --profile dev exec app-dev \
            npx prisma db push --schema apps/backend/prisma/schema.prisma
        print_success "Schema enviado para o banco de dados!"
        ;;

    "generate")
        print_header "Gerando Cliente Prisma"
        docker compose --profile dev exec app-dev \
            npx prisma generate --schema apps/backend/prisma/schema.prisma
        print_success "Cliente Prisma gerado!"
        ;;

    "studio")
        print_header "Abrindo Prisma Studio"
        print_info "Prisma Studio estará disponível em http://localhost:5555"
        docker compose --profile dev exec app-dev \
            npx prisma studio --schema apps/backend/prisma/schema.prisma
        ;;

    "clean")
        print_header "Limpando Recursos Docker"
        print_warning "Isso irá remover containers, volumes e imagens"
        read -p "Tem certeza? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            docker compose --profile dev down -v
            docker system prune -f
            print_success "Recursos Docker limpos!"
        else
            print_info "Limpeza cancelada."
        fi
        ;;

    "status")
        print_header "Status do Ambiente de Desenvolvimento"
        docker compose --profile dev ps
        ;;

    "install")
        print_header "Instalando Dependências"
        docker compose --profile dev exec app-dev npm install
        print_success "Dependências instaladas!"
        ;;

    "build")
        print_header "Construindo Aplicações"
        docker compose --profile dev exec app-dev npm run build
        print_success "Aplicações construídas!"
        ;;

    "prod-start")
        print_header "Iniciando Ambiente de Produção"
        check_docker
        docker compose --profile prod up -d --build
        print_success "Ambiente de produção iniciado!"
        print_info "Aplicação: http://localhost:3000"
        ;;

    "prod-stop")
        print_header "Parando Ambiente de Produção"
        docker compose --profile prod down
        print_success "Ambiente de produção parado!"
        ;;

    "prod-logs")
        print_header "Visualizando Logs de Produção"
        docker compose --profile prod logs -f
        ;;

    "help"|"")
        print_header "Auxiliar de Desenvolvimento Climbe"
        echo "Uso: ./scripts/dev.sh <comando>"
        echo ""
        echo "Comandos de Desenvolvimento:"
        echo "  start, up          Iniciar ambiente de desenvolvimento"
        echo "  stop, down         Parar ambiente de desenvolvimento"
        echo "  restart            Reiniciar ambiente de desenvolvimento"
        echo "  status             Mostrar status dos containers"
        echo "  logs               Visualizar logs da aplicação"
        echo "  db-logs            Visualizar logs do banco de dados"
        echo ""
        echo "Acesso aos Containers:"
        echo "  shell              Abrir shell bash no container da app"
        echo "  db-shell           Abrir shell MySQL"
        echo ""
        echo "Comandos do Banco de Dados:"
        echo "  migrate <nome>     Criar e executar nova migração"
        echo "  migrate-reset      Resetar banco (deleta todos os dados!)"
        echo "  db-push            Enviar mudanças do schema sem migração"
        echo "  generate           Gerar cliente Prisma"
        echo "  studio             Abrir Prisma Studio"
        echo ""
        echo "Ferramentas de Desenvolvimento:"
        echo "  install            Instalar/atualizar dependências"
        echo "  build              Construir aplicações"
        echo "  clean              Limpar recursos Docker"
        echo ""
        echo "Comandos de Produção:"
        echo "  prod-start         Iniciar ambiente de produção"
        echo "  prod-stop          Parar ambiente de produção"
        echo "  prod-logs          Visualizar logs de produção"
        echo ""
        echo "Exemplos:"
        echo "  ./scripts/dev.sh start"
        echo "  ./scripts/dev.sh migrate adicionar_tabela_usuario"
        echo "  ./scripts/dev.sh logs"
        ;;

    *)
        print_error "Comando desconhecido: $1"
        print_info "Execute './scripts/dev.sh help' para ver comandos disponíveis"
        exit 1
        ;;
esac
