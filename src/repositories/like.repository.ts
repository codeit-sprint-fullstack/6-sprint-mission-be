import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeRepository = {
  createLike: async (
    userId: string,
    articleId: number | null = null,
    productId: number | null = null
  ) => {
    return prisma.like.create({
      data: {
        userId,
        articleId,
        productId,
      },
    });
  },

  deleteLike: async (
    userId: string,
    articleId: number | null = null,
    productId: number | null = null
  ) => {
    const where: any = { userId };
    if (articleId) {
      where.articleId = articleId;
    }
    if (productId) {
      where.productId = productId;
    }
    return prisma.like.delete({
      where,
    });
  },

  countLikesByArticleId: async (articleId: number) => {
    return prisma.like.count({
      where: { articleId },
    });
  },

  countLikesByProductId: async (productId: number) => {
    return prisma.like.count({
      where: { productId },
    });
  },

  findLikeByUserIdAndArticleId: async (userId: string, articleId: number) => {
    return prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  },

  findLikeByUserIdAndProductId: async (userId: string, productId: number) => {
    return prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },
};

export default likeRepository; 