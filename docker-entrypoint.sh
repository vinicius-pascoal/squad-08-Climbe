#!/usr/bin/env bash
set -euo pipefail

echo "Aguardando banco MySQL ficar pronto (host=db:3306)..."
ATTEMPTS=0
until mysqladmin ping -h db -P 3306 -p"${MYSQL_ROOT_PASSWORD:-root}" --silent; do
  ATTEMPTS=$((ATTEMPTS+1))
  if [ $ATTEMPTS -gt 60 ]; then echo "Banco não respondeu a tempo."; exit 1; fi
  echo "Aguardando DB... tentativa $ATTEMPTS"; sleep 2
done

echo "Gerando Prisma Client..."
npx prisma generate --schema apps/backend/prisma/schema.prisma

echo "Aplicando migrações (ou sincronizando schema)"
npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma || \
npx prisma db push --schema apps/backend/prisma/schema.prisma

echo "Iniciando backend (Express) em :3000"
node apps/backend/dist/server.js
