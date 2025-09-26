# Deploy na Vercel — Turborepo (Vue + Node/Express + Prisma/MySQL)

Este pacote contém os ajustes para publicar **um único projeto** na Vercel:
- **Frontend (Vite + Vue 3)** servido como _static build_ (`apps/frontend/dist`).
- **Backend (Express + Prisma)** exposto por uma **Serverless Function** (catch‑all) em `/api/*`.

A dev com **Docker** permanece igual (compose não foi alterado).

---

## O que foi adicionado/alterado

1) **`vercel.json` (raiz)**  
   - Executa o _build_ do backend (inclui `prisma generate`) e do frontend.  
   - Define `outputDirectory: "apps/frontend/dist"` (Vercel servirá o SPA).  
   - Reescreve:
     - `"/api/:match*"` → `"/api/[...all].ts"` (proxy completo do Express)
     - `"/login"` e `"/oauth2callback"` → `"/api/[...all].ts"` (Google OAuth)
     - `"/(.*)"` → `"/index.html"` (fallback de SPA)

2) **Serverless Function** `api/[...all].ts`  
   - Importa o **Express** já compilado (`apps/backend/dist/app.js`) e **encaminha qualquer** rota para ele.

3) **`apps/backend/src/app.ts`**  
   - O _serve_ do frontend estático agora só acontece **fora** da Vercel (Docker/dev).  
     Em produção (Vercel), quem serve o SPA é a própria plataforma.

4) **`apps/backend/src/middlewares/google.ts`**  
   - Suporte a `VERCEL_URL` para descobrir automaticamente o domínio em produção:  
     - `BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || https://<VERCEL_URL>`  
     - `FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || https://<VERCEL_URL>`

5) **`.env.vercel.example` (raiz)** e **`apps/frontend/.env.production`**  
   - `VITE_API_BASE=/api` e `VITE_BACKEND_URI=` (vazio → usa mesmo domínio).  
   - Placeholders para `DATABASE_URL`, Google OAuth, JWT, SMTP etc.

---

## Pré‑requisitos

- Repositório hospedado (GitHub/GitLab/Bitbucket).
- Um MySQL gerenciado acessível pela Vercel (ex.: PlanetScale, RDS, Azure).  
  > **Importante:** Vercel não acessa seu MySQL do `docker-compose`.  
  > Crie `DATABASE_URL` para a base **na nuvem**.

- Credenciais Google OAuth2 (Client ID/Secret) com **Authorized redirect URI**:  
  ```
  https://SEU-PROJETO.vercel.app/oauth2callback
  ```
  (se usar domínio próprio, ajuste para o domínio customizado)

---

## Passo a passo (Vercel)

1. **Suba este código** para o seu repositório (com os arquivos novos).
2. **Importe o projeto** na Vercel (botão *New Project* → escolha o repositório).
3. **Root Directory**: selecione **a raiz** do monorepo (onde está `vercel.json`).
4. **Build & Output Settings**
   - **Build Command**: a Vercel lerá do `vercel.json`. Não precisa alterar.
   - **Output Directory**: a Vercel lerá do `vercel.json` (`apps/frontend/dist`).
5. **Environment Variables** (Settings → Environment Variables)
   - Copie os valores de `.env.vercel.example`.
   - Defina ao menos:
     - `DATABASE_URL` (MySQL gerenciado)
     - `JWT_SECRET`
     - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (se usar login Google)
     - (opcional) `FRONTEND_ORIGIN` / `BACKEND_ORIGIN` se tiver domínio customizado
6. **Deploy**.
7. No **Google Cloud Console**, garanta que o **Authorized redirect URI** aponta para:
   ```
   https://SEU-PROJETO.vercel.app/oauth2callback
   ```

> Após o deploy:
> - `GET https://SEU-PROJETO.vercel.app/api/health` deve retornar `{ ok: true }`.
> - Aponte o login Google para `"/login"` (já mapeado pela rewrite da Vercel).

---

## Dev com Docker (inalterado)

- Continue usando o `docker-compose.yml` normalmente.
- O frontend em dev (Vite) **proxy** `"/api"` → `http://localhost:3000`.
- O backend (Express) roda em `http://localhost:3000` consumindo o MySQL do compose.

---

## Variáveis essenciais

**Backend**
- `DATABASE_URL` — MySQL (formato Prisma): `mysql://user:pass@host:3306/dbname`
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`
- `SMTP_*` (se enviar e‑mails)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (se usar OAuth)

**Frontend**
- `VITE_API_BASE=/api`
- `VITE_BACKEND_URI=` (vazio → `/login` no mesmo domínio)

---

## Troubleshooting

- **Prisma “Invalid `prisma` invocation / binaries”**  
  Rode novamente o deploy. O `prisma generate` já está no `buildCommand`.  
  Se persistir, fixe o Node em “Project Settings → Node.js Version (20)”.

- **404 nas rotas do Vue (SPA)**  
  A rewrite `"/(.*)" → "/index.html"` no `vercel.json` cuida do fallback.

- **Google OAuth voltando para localhost**  
  Defina `FRONTEND_ORIGIN` / `BACKEND_ORIGIN` **ou** confira `VERCEL_URL` na Vercel.

---

Feito com ❤️ para manter seu fluxo **Docker em dev** e **Serverless na Vercel** em prod sem fricção.
