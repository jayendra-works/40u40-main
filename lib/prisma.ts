import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  // Prisma Accelerate uses `prisma://` URLs and avoids direct TCP from serverless runtimes.
  if ((process.env.DATABASE_URL ?? "").startsWith("prisma://")) {
    return client.$extends(withAccelerate()) as unknown as PrismaClient;
  }

  return client;
}

type PrismaClientType = PrismaClient;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
