FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS builder
COPY package.json turbo.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm install
COPY . .
RUN npx prisma generate --schema apps/backend/prisma/schema.prisma
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
# Copy root package.json so tools that expect /app/package.json don't fail
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]
