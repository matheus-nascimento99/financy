# Financy

Aplicação full stack para organização de finanças pessoais. O usuário cria conta, faz login e gerencia **transações** e **categorias** vinculadas apenas à sua conta.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | TypeScript, GraphQL (Apollo Server), Prisma, SQLite, Fastify, JWT |
| **Frontend** | TypeScript, React, Vite, Apollo Client, Tailwind CSS, React Hook Form, Zod |

## Estrutura

```
financy/
├── backend/     # API GraphQL
├── frontend/    # Interface React
└── packages/    # Configurações compartilhadas (opcional)
```

## Funcionalidades

- Cadastro e login com JWT
- CRUD de transações (criar, listar, editar, excluir)
- CRUD de categorias (criar, listar, editar, excluir)
- Isolamento por usuário: cada um vê apenas seus próprios dados
- Dashboard com resumo financeiro
- Páginas: login, cadastro, dashboard, transações, categorias e perfil

## Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18 (recomendado: versão do `.nvmrc`, 24.x)
- [pnpm](https://pnpm.io/) 9.x (`corepack enable` ou `npm i -g pnpm`)

## Como rodar

### 1. Instalar dependências

Na raiz do repositório:

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

**Backend** — copie o exemplo e ajuste os valores:

```bash
cp backend/.env.example backend/.env
```

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL do SQLite (ex.: `file:./dev.db`) |
| `JWT_SECRET` | Chave secreta para tokens JWT |
| `PORT` | Porta do servidor (padrão: `3333`) |

**Frontend** — copie o exemplo e aponte para a API:

```bash
cp frontend/.env.example frontend/.env
```

| Variável | Descrição |
|----------|-----------|
| `VITE_BACKEND_URL` | URL do GraphQL (ex.: `http://localhost:3333/graphql`) |

### 3. Banco de dados (backend)

```bash
cd backend
pnpm prisma:generate
pnpm prisma:migrate
cd ..
```

### 4. Subir o projeto

**Opção A — tudo junto (raiz do monorepo):**

```bash
pnpm dev
```

**Opção B — apps separados:**

```bash
# Terminal 1
cd backend && pnpm dev

# Terminal 2
cd frontend && pnpm dev
```

- API: `http://localhost:3333` (GraphQL em `/graphql`)
- Frontend: `http://localhost:5173` (porta padrão do Vite)

## Scripts úteis (raiz)

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Sobe backend e frontend em modo desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm lint` | Lint nos pacotes |
| `pnpm --filter backend prisma:studio` | Interface visual do banco (Prisma Studio) |

## Rodar sem monorepo

Cada pasta também funciona de forma independente:

```bash
cd backend && npm install && cp .env.example .env && npx prisma migrate dev && npm run dev
```

```bash
cd frontend && npm install && cp .env.example .env && npm run dev
```
