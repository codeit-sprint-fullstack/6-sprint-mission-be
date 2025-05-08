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
  console.log("Starting database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();

  // Insert articles one by one and store their IDs
  console.log("Creating articles...");
  const articleIds = [];
  for (const article of ArticleMocks) {
    const createdArticle = await prisma.article.create({
      data: article,
    });
    articleIds.push(createdArticle.id);
  }

  // Insert products one by one and store their IDs
  console.log("Creating products...");
  const productIds = [];
  for (const product of ProductMocks) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    productIds.push(createdProduct.id);
  }

  // Create comments with valid references
  console.log("Creating comments...");
  const validComments = [];

  // Process each comment in the mock data
  for (const comment of CommentMocks) {
    // Create a new comment object
    const newComment = { content: comment.content };

    // Add articleId only if it references a valid article
    if (comment.articleId) {
      // Make sure we reference a valid article ID
      const validIndex = (comment.articleId - 1) % articleIds.length;
      newComment.articleId = articleIds[validIndex];
    }

    // Add productId only if it references a valid product
    if (comment.productId) {
      // Make sure we reference a valid product ID
      const validIndex = (comment.productId - 1) % productIds.length;
      newComment.productId = productIds[validIndex];
    }

    validComments.push(newComment);
  }

  // Create all comments with valid references
  if (validComments.length > 0) {
    for (const comment of validComments) {
      await prisma.comment.create({
        data: comment,
      });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed");
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
