#!/bin/bash

# =============================================================================
# SCRIPT DE VERIFICAÇÃO DE SAÚDE CLIMBE
# =============================================================================
# Este script verifica se todos os serviços estão executando corretamente
# Uso: ./scripts/health-check.sh
# =============================================================================

set -e

# Cores para saída
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

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

# Verificar se um serviço está respondendo
check_service() {
    local url=$1
    local service_name=$2
    local timeout=${3:-10}

    if curl -f -s --max-time $timeout "$url" > /dev/null 2>&1; then
        print_success "$service_name está respondendo"
        return 0
    else
        print_error "$service_name não está respondendo em $url"
        return 1
    fi
}

# Verificar se os containers Docker estão executando
check_containers() {
    print_info "Verificando containers Docker..."

    local containers=$(docker compose --profile dev ps --services --filter "status=running" 2>/dev/null || echo "")

    if [[ -z "$containers" ]]; then
        print_error "Nenhum container está executando. Inicie com: ./scripts/dev.sh start"
        return 1
    fi

    while IFS= read -r container; do
        if [[ -n "$container" ]]; then
            print_success "Container '$container' está executando"
        fi
    done <<< "$containers"

    return 0
}

# Verificar conexão com banco de dados
check_database() {
    print_info "Verificando conexão com banco de dados..."

    if docker compose --profile dev exec -T db mysqladmin ping -h localhost -u app -papp > /dev/null 2>&1; then
        print_success "Banco de dados está respondendo"
        return 0
    else
        print_error "Banco de dados não está respondendo"
        return 1
    fi
}

# Verificação principal de saúde
main() {
    print_header "Verificação de Saúde Climbe"

    local exit_code=0

    # Verificar se o Docker está executando
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está executando"
        exit 1
    fi
    print_success "Docker está executando"

    # Verificar containers
    if ! check_containers; then
        exit_code=1
    fi

    # Aguardar um momento para os serviços ficarem prontos
    sleep 2

    # Verificar banco de dados
    if ! check_database; then
        exit_code=1
    fi

    # Verificar API backend
    if ! check_service "http://localhost:3000/api/health" "API Backend"; then
        exit_code=1
    fi

    # Verificar frontend (em modo desenvolvimento)
    if ! check_service "http://localhost:5173" "Frontend (Servidor Dev)" 5; then
        print_warning "Servidor de desenvolvimento do frontend pode não estar pronto ainda (isso é normal durante a inicialização)"
    fi

    echo ""
    if [ $exit_code -eq 0 ]; then
        print_header "🎉 Todos os Serviços Estão Saudáveis!"
        echo ""
        print_info "Acesse sua aplicação:"
        echo "  • Frontend: http://localhost:5173"
        echo "  • API Backend: http://localhost:3000/api/health"
        echo "  • Banco de dados: localhost:3306"
        echo ""
        print_info "Comandos úteis:"
        echo "  • Visualizar logs: ./scripts/dev.sh logs"
        echo "  • Abrir shell: ./scripts/dev.sh shell"
        echo "  • Shell do banco: ./scripts/dev.sh db-shell"
        echo "  • Prisma Studio: ./scripts/dev.sh studio"
    else
        print_header "❌ Alguns Serviços Não Estão Saudáveis"
        echo ""
        print_info "Passos para solução de problemas:"
        echo "  1. Verificar status dos containers: docker compose --profile dev ps"
        echo "  2. Visualizar logs: ./scripts/dev.sh logs"
        echo "  3. Reiniciar serviços: ./scripts/dev.sh restart"
        echo "  4. Verificar o README.md para mais dicas de solução de problemas"
    fi

    exit $exit_code
}

# Executar a verificação de saúde
main "$@"
