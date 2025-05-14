import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeRepository = {
  createLike: async (userId, articleId = null, productId = null) => {
    return prisma.like.create({
      data: {
        userId,
        articleId,
        productId,
      },
    });
  },

  deleteLike: async (userId, articleId = null, productId = null) => {
    const where = {
      userId,
    };
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

  countLikesByArticleId: async (articleId) => {
    return prisma.like.count({
      where: { articleId },
    });
  },

  countLikesByProductId: async (productId) => {
    return prisma.like.count({
      where: { productId },
    });
  },

  findLikeByUserIdAndArticleId: async (userId, articleId) => {
    return prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  },

  findLikeByUserIdAndProductId: async (userId, productId) => {
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