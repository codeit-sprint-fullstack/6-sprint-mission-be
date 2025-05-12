import { PrismaClient } from "@prisma/client";
import { ARTICLE_MOCK, ARTICLE_COMMENT_MOCK } from "./mock/articleMock.js";
import {
  PRODUCT_MOCK,
  PRODUCT_COMMENT_MOCK,
  PRODUCT_LIKE_MOCK,
} from "./mock/productMock.js";

const prisma = new PrismaClient();

async function main() {
  // 데이터 초기화
  await prisma.productLike.deleteMany();

  // 시드데이터 삽입
  await prisma.productLike.createMany({
    data: PRODUCT_LIKE_MOCK,
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
