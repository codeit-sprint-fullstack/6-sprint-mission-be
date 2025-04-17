import { PrismaClient } from "@prisma/client";
import { ArticleMocks } from "./mocks/articleMocks.js";
import { ProductMocks } from "./mocks/productMocks.js";
import { CommentMocks } from "./mocks/comments.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  // Clear existing data in the correct order (to avoid foreign key constraints)
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();

  // Create articles first
  const articles = await prisma.article.createMany({
    data: ArticleMocks,
    skipDuplicates: true,
  });

  // Create products next
  const products = await prisma.product.createMany({
    data: ProductMocks,
    skipDuplicates: true,
  });

  // Now that both articles and products exist, create comments
  await prisma.comment.createMany({
    data: CommentMocks,
    skipDuplicates: true,
  });

  console.log("Seeding completed successfully");
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
// import { PrismaClient } from '@prisma/client';
// import { ArticleMocks } from './mocks/articleMocks.js';
// import { ProductMocks } from './mocks/productMocks.js';
// import { CommentMocks } from './mocks/comments.js';

// const prisma = new PrismaClient({
//     datasources: {
//         db: {
//             url: process.env.DATABASE_URL,
//         },
//     },
// });

// async function main() {
//     // 기존 데이터 삭제
//     await prisma.article.deleteMany();
//     await prisma.product.deleteMany();
//     await prisma.comment.deleteMany();

//     // 목 데이터 삽입
//     await prisma.article.createMany({
//         data: ArticleMocks,
//         skipDuplicates: true,
//     });
//     await prisma.product.createMany({
//         data: ProductMocks,
//         skipDuplicates: true,
//     });
//     await prisma.comment.createMany({
//         data: CommentMocks,
//         skipDuplicates: true,
//     });
// }

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
