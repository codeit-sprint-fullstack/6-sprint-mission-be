import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const commentRepository = {
  createComment: async (
    userId: string,
    content: string,
    articleId: number | null = null,
    productId: number | null = null
  ) => {
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

  findAllCommentsByArticleId: async (articleId: number) => {
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

  findAllCommentsByProductId: async (productId: number) => {
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

  findCommentById: async (id: number) => {
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

  updateComment: async (id: number, content: string) => {
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

  deleteComment: async (id: number) => {
    return prisma.comment.delete({
      where: { id },
    });
  },
};

export default commentRepository; 