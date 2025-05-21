const { PrismaClient } = require("@prisma/client");
const { mockArticles, mockProducts, mockComments } = require("./mock");

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.comment.deleteMany();

  // id 값 리셋
  await prisma.$executeRaw`ALTER SEQUENCE "Article_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1`;

  // 목 데이터 삽입
  await prisma.article.createMany({
    data: mockArticles,
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: mockProducts,
    skipDuplicates: true,
  });

  // 실제 저장된 개수 가져오기
  const articles = await prisma.article.findMany({ select: { id: true } });
  const products = await prisma.product.findMany({ select: { id: true } });

  const commentData = [];

  for (const article of articles) {
    mockComments.forEach((comment) => {
      commentData.push({
        content: comment.content,
        articleId: article.id,
      });
    });
  }

  for (const product of products) {
    mockComments.forEach((comment) => {
      commentData.push({
        content: comment.content,
        productId: product.id,
      });
    });
  }

  await prisma.comment.createMany({
    data: commentData,
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
