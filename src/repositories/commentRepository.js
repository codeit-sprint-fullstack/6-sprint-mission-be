import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const commentRepository = {
  createComment: async (userId, content, articleId = null, productId = null) => {
    return prisma.comment.create({
      data: {
        userId,
        content,
        articleId,
        productId,
      },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  },

  findAllCommentsByArticleId: async (articleId) => {
    return prisma.comment.findMany({
      where: { articleId },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findAllCommentsByProductId: async (productId) => {
    return prisma.comment.findMany({
      where: { productId },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findCommentById: async (id) => {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  },

  updateComment: async (id, content) => {
    return prisma.comment.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
      },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  },

  deleteComment: async (id) => {
    return prisma.comment.delete({
      where: { id },
    });
  },
};

export default commentRepository;