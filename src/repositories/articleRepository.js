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

  findAllArticles: async (sort, search, skip, limit) => {
    const orderBy = {};
    if (sort === 'like') {
      orderBy._count = { likes: 'desc' };
    } else {
      orderBy.createdAt = 'desc'; 
    }

    // NaN 방지 처리
    if (isNaN(skip) || skip < 0) skip = 0;
    if (isNaN(limit) || limit < 1) limit = 10;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { user: { nickname: { contains: search } } },
      ];
    }

    return prisma.article.findMany({
      where,
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
      orderBy,
      skip,
      take: limit,
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