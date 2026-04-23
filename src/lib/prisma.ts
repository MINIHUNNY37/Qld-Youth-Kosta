import { PrismaClient } from "@prisma/client";

// Reuse a single Prisma client in development to avoid exhausting connections
// on hot-reload. In production one instance per server process is fine.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
