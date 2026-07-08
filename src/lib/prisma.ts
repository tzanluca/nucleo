import { PrismaClient } from "@prisma/client";

/**
 * Instância única do Prisma. Em dev, o hot-reload do Next recria os módulos a
 * cada mudança; guardar o client no globalThis evita esgotar conexões.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
