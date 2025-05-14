import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const articleRepository = {
  createArticle: async (userId, title, content, images) => {
    return prisma.article.create({
      data: {
        userId,
        title,
        content,
        images,
      },
    });
  },

  findAllArticles: async () => {
    return prisma.article.findMany({
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findArticleById: async (id) => {
    return prisma.article.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        likes: true,
        comments: {
          include: {
            writer: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
      },
    });
  },

  updateArticle: async (id, title, content, images) => {
    return prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        images,
        updatedAt: new Date(),
      },
    });
  },

  deleteArticle: async (id) => {
    return prisma.article.delete({
      where: { id },
    });
  },
};

export default articleRepository;