const { PrismaClient } = require("@prisma/client");
const {
  mockArticles,
  mockCommunityComments,
  mockMarketComments,
} = require("./mock");

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.communityComment.deleteMany();
  await prisma.marketComment.deleteMany();
  await prisma.article.deleteMany();

  // id 값 리셋
  await prisma.$executeRaw`ALTER SEQUENCE "Article_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "CommunityComment_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "MarketComment_id_seq" RESTART WITH 1`;

  for (const article of mockArticles) {
    const createdArticle = await prisma.article.create({
      data: article,
    });

    for (const comment of mockCommunityComments) {
      await prisma.communityComment.create({
        data: {
          content: comment.content,
          articleId: createdArticle.id,
        },
      });
    }
  }

  for (const marketComment of mockMarketComments) {
    await prisma.marketComment.create({
      data: marketComment,
    });
  }
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
