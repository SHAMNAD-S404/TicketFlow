import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyDBConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    return false;
  }
};
