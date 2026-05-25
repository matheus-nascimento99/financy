import Fastify from "fastify";
import cors from "@fastify/cors";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { PrismaClient } from "@prisma/client";
import { env } from "./config/env.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers, type Context } from "./graphql/resolvers.js";
import { verifyToken } from "./config/auth.js";

const prisma = new PrismaClient();

async function startServer() {
  const app = Fastify();

  await app.register(cors, {
    origin: "*",
    credentials: true,
  });

  const apollo = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await apollo.start();

  await app.register(fastifyApollo(apollo), {
    context: async (request): Promise<Context> => {
      const token = request.headers.authorization?.replace("Bearer ", "");

      let userId: string | undefined;
      let email: string | undefined;

      if (token) {
        const payload = verifyToken(token);
        if (payload) {
          userId = payload.userId;
          email = payload.email;
        }
      }

      return {
        prisma,
        userId,
        email,
      };
    },
  });

  app.get("/health", async () => {
    return { ok: true };
  });

  await app.listen({ port: env.PORT, host: "0.0.0.0" });

  console.log(`🚀 Server running at http://localhost:${env.PORT}`);
}

startServer();