import { PrismaClient } from '@prisma/client';
import { ArticleResponseDto } from '../Types/article';

const prisma = new PrismaClient();

const articleRepository = {
  createArticle: async (userId: string, title: string, content: string, images: string[]): Promise<ArticleResponseDto> => {
    return prisma.article.create({
      data: {
        userId,
        title,
        content,
        images,
      },
    }) as unknown as ArticleResponseDto;
  },

  findAllArticles: async (
    sort: string,
    search: string | undefined,
    skip: number,
    limit: number
  ): Promise<ArticleResponseDto[]> => {
    const orderBy: any = {};
    if (sort === 'like') {
      orderBy._count = { likes: 'desc' };
    } else {
      orderBy.createdAt = 'desc';
    }

    if (isNaN(skip) || skip < 0) skip = 0;
    if (isNaN(limit) || limit < 1) limit = 10;

    const where: any = {};
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
    }) as unknown as ArticleResponseDto[];
  },

  findArticleById: async (id: number): Promise<ArticleResponseDto | null> => {
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
    }) as unknown as ArticleResponseDto | null;
  },

  updateArticle: async (id: number, title: string, content: string, images: string[]): Promise<ArticleResponseDto> => {
    return prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        images,
        updatedAt: new Date(),
      },
    }) as unknown as ArticleResponseDto;
  },

  deleteArticle: async (id: number): Promise<void> => {
    await prisma.article.delete({
      where: { id },
    });
  },
};

export default articleRepository; 