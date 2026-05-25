# Finance Management Backend API

## Prerequisites

- Node.js 18+
- pnpm

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

The required environment variables are:
- `DATABASE_URL`: SQLite database connection string (e.g., `file:./dev.db`)
- `JWT_SECRET`: Secret key for JWT token signing (generate a secure random string)
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 3333)

### 3. Set up Database

```bash
pnpm prisma:migrate
```

This will:
- Create the SQLite database file
- Run all migrations
- Generate Prisma Client

### 4. Start the Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:3333` with GraphQL endpoint at `http://localhost:3333/graphql`

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)

## API Documentation

### GraphQL Endpoint

`POST http://localhost:3333/graphql`

### Authentication

Include JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Queries

#### Sign Up

```graphql
mutation {
  signup(input: {
    email: "user@example.com"
    password: "password123"
    name: "John Doe"
  }) {
    token
    user {
      id
      email
      name
    }
  }
}
```

#### Login

```graphql
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
      name
    }
  }
}
```

#### Get Current User

```graphql
query {
  me {
    id
    email
    name
    categories {
      id
      name
      color
    }
    transactions {
      id
      description
      amount
      type
      date
      category {
        name
      }
    }
  }
}
```

#### Create Category

```graphql
mutation {
  createCategory(input: {
    name: "Groceries"
    color: "#FF5733"
  }) {
    id
    name
    color
  }
}
```

#### Create Transaction

```graphql
mutation {
  createTransaction(input: {
    description: "Weekly groceries"
    amount: 150.50
    type: "expense"
    date: "2024-01-15T10:30:00Z"
    categoryId: "category_id_here"
  }) {
    id
    description
    amount
    type
    date
  }
}
```

#### List Transactions

```graphql
query {
  transactions {
    id
    description
    amount
    type
    date
    category {
      id
      name
    }
  }
}
```

#### List Categories

```graphql
query {
  categories {
    id
    name
    color
    transactions {
      id
      description
      amount
    }
  }
}
```

#### Update Transaction

```graphql
mutation {
  updateTransaction(id: "transaction_id", input: {
    description: "Updated description"
    amount: 200.00
  }) {
    id
    description
    amount
  }
}
```

#### Delete Transaction

```graphql
mutation {
  deleteTransaction(id: "transaction_id")
}
```

#### Update Category

```graphql
mutation {
  updateCategory(id: "category_id", input: {
    name: "Updated Category"
    color: "#000000"
  }) {
    id
    name
    color
  }
}
```

#### Delete Category

```graphql
mutation {
  deleteCategory(id: "category_id")
}
```

## Project Structure

```
src/
├── config/
│   ├── auth.ts          # JWT and password utilities
│   └── env.ts           # Environment configuration
├── graphql/
│   ├── schema.ts        # GraphQL type definitions
│   └── resolvers.ts     # GraphQL resolvers and business logic
└── server.ts            # Main server entry point

prisma/
└── schema.prisma        # Database schema definition
```

## Technology Stack

- **Framework**: Fastify
- **GraphQL**: Apollo Server
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Language**: TypeScript

## Features

✅ User authentication (signup/login)
✅ Transaction management (CRUD operations)
✅ Category management (CRUD operations)
✅ User data isolation
✅ CORS support
✅ GraphQL API
✅ SQLite database
✅ JWT authentication
✅ Type-safe with TypeScript

## Data Models

### User
- id: Unique identifier
- email: User email (unique)
- password: Hashed password
- name: User full name
- createdAt: Account creation timestamp
- updatedAt: Last update timestamp

### Category
- id: Unique identifier
- name: Category name
- color: Optional color code
- userId: Reference to user
- createdAt: Creation timestamp
- updatedAt: Last update timestamp

### Transaction
- id: Unique identifier
- description: Transaction description
- amount: Transaction amount
- type: "income" or "expense"
- date: Transaction date
- userId: Reference to user
- categoryId: Optional reference to category
- createdAt: Creation timestamp
- updatedAt: Last update timestamp
