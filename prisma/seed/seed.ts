import { PrismaClient } from "@prisma/client";
import { articleMocks } from "./mocks/article.mocks";
import { productMocks } from "./mocks/product.mocks";
import { commentMocks } from "./mocks/comment.mocks";
import { userMocks } from "./mocks/user.mocks";

const prisma = new PrismaClient();

async function main() {
  // 외래키 의존성 역순으로 삭제
  await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE "Comment", "Product", "Article"
  RESTART IDENTITY CASCADE;
`);
  await prisma.user.deleteMany();

  // id 값 리셋
  await prisma.$executeRaw`ALTER SEQUENCE "Article_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1`;

  await prisma.user.createMany({
    data: userMocks,
    skipDuplicates: true,
  });
  await prisma.article.createMany({
    data: articleMocks,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: productMocks,
    skipDuplicates: true,
  });
  await prisma.comment.createMany({
    data: commentMocks,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
