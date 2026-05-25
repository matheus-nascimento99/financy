import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import { hashPassword, comparePasswords, generateToken } from "../config/auth.js";

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  email?: string;
}

function ensureAuthenticated(context: Context): Context & { userId: string; email: string } {
  if (!context.userId || !context.email) {
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context as Context & { userId: string; email: string };
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      const authContext = ensureAuthenticated(context);
      return context.prisma.user.findUnique({
        where: { id: authContext.userId },
        include: {
          categories: true,
          transactions: true,
        },
      });
    },

    categories: async (_: unknown, __: unknown, context: Context) => {
      const authContext = ensureAuthenticated(context);
      return context.prisma.category.findMany({
        where: { userId: authContext.userId },
        include: { transactions: true },
      });
    },

    category: async (_: unknown, args: { id: string }, context: Context) => {
      const authContext = ensureAuthenticated(context);
      return context.prisma.category.findUnique({
        where: { id: args.id },
        include: { transactions: true },
      });
    },

    transactions: async (_: unknown, __: unknown, context: Context) => {
      const authContext = ensureAuthenticated(context);
      return context.prisma.transaction.findMany({
        where: { userId: authContext.userId },
        include: { category: true },
      });
    },

    transactionsPaginated: async (
      _: unknown,
      args: {
        filter?: {
          search?: string;
          type?: string;
          categoryId?: string;
          month?: number;
          year?: number;
        };
        page?: number;
        pageSize?: number;
      },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);
      const page = Math.max(1, args.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, args.pageSize ?? 10));
      const filter = args.filter ?? {};

      const where: {
        userId: string;
        description?: { contains: string };
        type?: string;
        categoryId?: string;
        date?: { gte: Date; lt: Date };
      } = {
        userId: authContext.userId,
      };

      const search = filter.search?.trim();
      if (search) {
        where.description = { contains: search };
      }

      if (filter.type && filter.type !== "all") {
        where.type = filter.type;
      }

      if (filter.categoryId && filter.categoryId !== "all") {
        where.categoryId = filter.categoryId;
      }

      if (filter.month && filter.year) {
        where.date = {
          gte: new Date(Date.UTC(filter.year, filter.month - 1, 1)),
          lt: new Date(Date.UTC(filter.year, filter.month, 1)),
        };
      }

      const [items, total] = await Promise.all([
        context.prisma.transaction.findMany({
          where,
          include: { category: true },
          orderBy: { date: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        context.prisma.transaction.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
    },

    transaction: async (_: unknown, args: { id: string }, context: Context) => {
      const authContext = ensureAuthenticated(context);
      return context.prisma.transaction.findUnique({
        where: { id: args.id },
        include: { category: true },
      });
    },
  },

  Mutation: {
    signup: async (
      _: unknown,
      args: {
        input: {
          email: string;
          password: string;
          name: string;
        };
      },
      context: Context
    ) => {
      const { email, password, name } = args.input;

      const existingUser = await context.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new GraphQLError("User already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const hashedPassword = await hashPassword(password);

      const user = await context.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      return {
        token,
        user,
      };
    },

    login: async (
      _: unknown,
      args: {
        input: {
          email: string;
          password: string;
        };
      },
      context: Context
    ) => {
      const { email, password } = args.input;

      const user = await context.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const passwordMatch = await comparePasswords(password, user.password);

      if (!passwordMatch) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      return {
        token,
        user,
      };
    },

    updateUser: async (
      _: unknown,
      args: {
        input: {
          name?: string;
        };
      },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);
      const { name } = args.input;

      const user = await context.prisma.user.update({
        where: { id: authContext.userId },
        data: {
          ...(name && { name }),
        },
      });

      return user;
    },

    createCategory: async (
      _: unknown,
      args: {
        input: {
          name: string;
          color: string;
          description?: string;
          icon?: string;
        };
      },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);
      const { name, color, description, icon } = args.input;

      return context.prisma.category.create({
        data: {
          name,
          color,
          description,
          icon,
          userId: authContext.userId,
        },
      });
    },

    updateCategory: async (
      _: unknown,
      args: {
        id: string;
        input: {
          name?: string;
          color?: string;
          description?: string;
          icon?: string;
        };
      },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);
      const { id } = args;
      const { name, color, description, icon } = args.input;

      const category = await context.prisma.category.findUnique({
        where: { id },
      });

      if (!category || category.userId !== authContext.userId) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return context.prisma.category.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(color && { color }),
          ...(description !== undefined && { description }),
          ...(icon !== undefined && { icon }),
        },
      });
    },

    deleteCategory: async (
      _: unknown,
      args: { id: string },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);

      const category = await context.prisma.category.findUnique({
        where: { id: args.id },
      });

      if (!category || category.userId !== authContext.userId) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await context.prisma.category.delete({
        where: { id: args.id },
      });

      return true;
    },

    createTransaction: async (
      _: unknown,
      args: {
        input: {
          description: string;
          amount: number;
          type: string;
          date: string;
          categoryId: string;
        };
      },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);
      const { description, amount, type, date, categoryId } = args.input;

      if (categoryId) {
        const category = await context.prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category || category.userId !== authContext.userId) {
          throw new GraphQLError("Category not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
      }

      return context.prisma.transaction.create({
        data: {
          description,
          amount,
          type,
          date: new Date(date),
          userId: authContext.userId,
          categoryId,
        },
        include: { category: true },
      });
    },

    updateTransaction: async (
      _: unknown,
      args: {
        id: string;
        input: {
          description?: string;
          amount?: number;
          type?: string;
          date?: string;
          categoryId?: string;
        };
      },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);
      const { id } = args;
      const { description, amount, type, date, categoryId } = args.input;

      const transaction = await context.prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction || transaction.userId !== authContext.userId) {
        throw new GraphQLError("Transaction not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (categoryId) {
        const category = await context.prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category || category.userId !== authContext.userId) {
          throw new GraphQLError("Category not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
      }

      return context.prisma.transaction.update({
        where: { id },
        data: {
          ...(description && { description }),
          ...(amount && { amount }),
          ...(type && { type }),
          ...(date && { date: new Date(date) }),
          ...(categoryId !== undefined && { categoryId }),
        },
        include: { category: true },
      });
    },

    deleteTransaction: async (
      _: unknown,
      args: { id: string },
      context: Context
    ) => {
      const authContext = ensureAuthenticated(context);

      const transaction = await context.prisma.transaction.findUnique({
        where: { id: args.id },
      });

      if (!transaction || transaction.userId !== authContext.userId) {
        throw new GraphQLError("Transaction not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await context.prisma.transaction.delete({
        where: { id: args.id },
      });

      return true;
    },
  },

  User: {
    createdAt: (user: { createdAt: Date }) => {
      const value = user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt);
      return value.toISOString();
    },
    updatedAt: (user: { updatedAt: Date }) => {
      const value = user.updatedAt instanceof Date ? user.updatedAt : new Date(user.updatedAt);
      return value.toISOString();
    },
    transactions: async (user: { id: string }, _: unknown, context: Context) => {
      return context.prisma.transaction.findMany({
        where: { userId: user.id },
        include: { category: true },
      });
    },
    categories: async (user: { id: string }, _: unknown, context: Context) => {
      return context.prisma.category.findMany({
        where: { userId: user.id },
      });
    },
  },

  Category: {
    user: async (category: { userId: string }, _: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: category.userId },
      });
    },
    transactions: async (category: { id: string }, _: unknown, context: Context) => {
      return context.prisma.transaction.findMany({
        where: { categoryId: category.id },
      });
    },
  },

  Transaction: {
    date: (transaction: { date: Date }) => {
      const value = transaction.date instanceof Date ? transaction.date : new Date(transaction.date);
      return value.toISOString();
    },
    user: async (transaction: { userId: string }, _: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: transaction.userId },
      });
    },
    category: async (transaction: { categoryId: string | null }, _: unknown, context: Context) => {
      if (!transaction.categoryId) return null;
      return context.prisma.category.findUnique({
        where: { id: transaction.categoryId },
      });
    },
  },
};
