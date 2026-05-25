# Financy

Aplicação full stack para organização de finanças pessoais. O usuário cria conta, faz login e gerencia **transações** e **categorias** vinculadas apenas à sua conta.

Monorepo com [Turborepo](https://turbo.build/) e [pnpm](https://pnpm.io/).

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** (`apps/backend`) | TypeScript, GraphQL (Apollo Server), Prisma, SQLite, Fastify, JWT |
| **Frontend** (`apps/frontend`) | TypeScript, React, Vite, Apollo Client, Tailwind CSS, React Hook Form, Zod |

## Estrutura

```
financy/
├── apps/
│   ├── backend/     # API GraphQL
│   └── frontend/    # Interface React
├── packages/
│   └── tsconfig/    # Configuração TypeScript compartilhada
├── package.json     # Scripts do monorepo
└── pnpm-workspace.yaml
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
cp apps/backend/.env.example apps/backend/.env
```

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL do SQLite (ex.: `file:./dev.db`) |
| `JWT_SECRET` | Chave secreta para tokens JWT |
| `PORT` | Porta do servidor (padrão: `3333`) |

**Frontend** — copie o exemplo e aponte para a API:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

| Variável | Descrição |
|----------|-----------|
| `VITE_BACKEND_URL` | URL do GraphQL (ex.: `http://localhost:3333/graphql`) |

### 3. Banco de dados (backend)

```bash
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
cd ../..
```

### 4. Subir o projeto

**Opção A — tudo junto (recomendado):**

```bash
pnpm dev
```

**Opção B — apps separados:**

```bash
# Terminal 1
pnpm --filter backend dev

# Terminal 2
pnpm --filter frontend dev
```

- API: `http://localhost:3333` (GraphQL em `/graphql`)
- Frontend: `http://localhost:5173` (porta padrão do Vite)

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Sobe backend e frontend em modo desenvolvimento |
| `pnpm build` | Build de produção de todos os apps |
| `pnpm lint` | Lint em todos os pacotes |
| `pnpm --filter backend prisma:studio` | Interface visual do banco (Prisma Studio) |

## Entrega do desafio

Para correção, o repositório público deve conter as pastas `backend` e `frontend` com a resolução obrigatória. Neste monorepo, o equivalente é `apps/backend` e `apps/frontend`.
