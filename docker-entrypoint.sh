#!/usr/bin/env bash
set -e
echo "Aguardando banco MySQL ficar pronto..."
ATTEMPTS=0
until node -e "const s=require('net').Socket();s.connect(3306,'db',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));" >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS+1))
  if [ $ATTEMPTS -gt 60 ]; then echo "Banco não respondeu a tempo."; exit 1; fi
  echo "Aguardando DB... tentativa $ATTEMPTS"; sleep 2
done
echo "Aplicando migrações (ou sincronizando schema)"
npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma || npx prisma db push --schema apps/backend/prisma/schema.prisma
# Opcional: rodar seed apenas se a variável RUN_SEED estiver verdadeira
if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Executando seed do banco de dados (RUN_SEED=true)"
  npx prisma db seed --schema apps/backend/prisma/schema.prisma || true
fi
echo "Iniciando backend (Express) em :3000"
node apps/backend/dist/index.js
