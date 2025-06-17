import { PrismaClient } from "@prisma/client";
import { articleMocks } from "./mocks/articleMocks";
import { productMocks } from "./mocks/productMocks";
import { commentMocks } from "./mocks/commentMocks";
import { userMocks } from "./mocks/userMocks";

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

  // 목 데이터 삽입
  // for (const user of userMocks) {
  //   await prisma.user.create({ data: user });
  // }
  // for (const article of articleMocks) {
  //   await prisma.article.create({ data: article });
  // }
  // for (const product of productMocks) {
  //   await prisma.product.create({ data: product });
  // }
  // for (const comment of commentMocks) {
  //   await prisma.comment.create({ data: comment });
  // }

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

  //   // 실제 저장된 개수 가져오기
  //   const articles = await prisma.article.findMany({ select: { id: true } });
  //   const products = await prisma.product.findMany({ select: { id: true } });

  //   interface CommentData {
  //     content: Comment["content"];
  //     articleId?: Comment["articleId"];
  //     productId?: Comment["productId"];
  //     writerId: Comment["writerId"];
  //     createdAt: Comment["createdAt"];
  //     updatedAt: Comment["updatedAt"];
  //   }

  //   const commentData: CommentData[] = [];

  //   for (const article of articles) {
  //     commentMocks.forEach((comment: Omit<Comment, "id">) => {
  //       commentData.push({
  //         content: comment.content,
  //         articleId: article.id,
  //         productId: null,
  //         writerId: comment.writerId,
  //         createdAt: comment.createdAt,
  //         updatedAt: comment.updatedAt,
  //       });
  //     });
  //   }

  //   for (const product of products) {
  //     commentMocks.forEach((comment: Omit<Comment, "id">) => {
  //       commentData.push({
  //         content: comment.content,
  //         productId: product.id,
  //         articleId: null,
  //         writerId: comment.writerId,
  //         createdAt: comment.createdAt,
  //         updatedAt: comment.updatedAt,
  //       });
  //     });
  //   }

  //   await prisma.comment.createMany({
  //     data: commentData,
  //   });
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
