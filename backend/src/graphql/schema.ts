export const typeDefs = `#graphql
  type User {
    id: String!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
    transactions: [Transaction!]!
    categories: [Category!]!
  }

  type Category {
    id: String!
    name: String!
    color: String!
    description: String
    icon: String
    createdAt: String!
    updatedAt: String!
    user: User!
    transactions: [Transaction!]!
  }

  type Transaction {
    id: String!
    description: String!
    amount: Float!
    type: String!
    date: String!
    createdAt: String!
    updatedAt: String!
    user: User!
    category: Category!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
  }

  input UpdateUserInput {
    name: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateCategoryInput {
    name: String!
    color: String!
    description: String
    icon: String
  }

  input UpdateCategoryInput {
    name: String
    color: String
    description: String
    icon: String
  }

  input CreateTransactionInput {
    description: String!
    amount: Float!
    type: String!
    date: String!
    categoryId: String!
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: String
    date: String
    categoryId: String
  }

  input TransactionsFilterInput {
    search: String
    type: String
    categoryId: String
    month: Int
    year: Int
  }

  type TransactionsPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type Query {
    me: User
    categories: [Category!]!
    category(id: String!): Category
    transactions: [Transaction!]!
    transactionsPaginated(
      filter: TransactionsFilterInput
      page: Int
      pageSize: Int
    ): TransactionsPage!
    transaction(id: String!): Transaction
  }

  type Mutation {
    signup(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!

    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: String!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: String!): Boolean!

    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: String!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: String!): Boolean!
  }
`;
