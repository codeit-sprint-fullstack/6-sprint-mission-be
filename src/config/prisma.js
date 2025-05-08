import { PrismaClient } from "@prisma/client";

let prisma;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Prisma 초기화 오류:", error);
  process.exit(1);
}

export default prisma;
