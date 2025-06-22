import { prismaClient } from '../../infra/prismaClient.js';
import { Article } from '../../domain/Article.js';
import { User } from '../../domain/User.js';
import { Like } from '../../domain/Like.js';
import { Prisma } from '@prisma/client';


interface IRequester {
  userId: number;
}

interface IGetArticleListDTO {
  cursor?: number;
  limit: number;
  orderBy?: 'recent' | 'favorite';
  keyword?: string;
}

export class GetArticleListHandler {
  static async handle(
    requester: IRequester,
    { cursor, limit, orderBy = 'recent', keyword }: IGetArticleListDTO
  ) {
    const orderByOption: Prisma.ArticleOrderByWithRelationInput =
      orderBy === 'favorite'
        ? { likes: { _count: 'desc' as Prisma.SortOrder } }
        : { createdAt: 'desc' };

    const articleEntities = await prismaClient.article.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      orderBy: orderByOption,
      where: {
        title: keyword ? { contains: keyword } : undefined,
      },
    });

    const articles = articleEntities.map((e) => new Article({ ...e, likes: [] }));

    const writerEntities = await prismaClient.user.findMany({
      where: {
        id: {
          in: Array.from(new Set(articles.map((a) => a.getWriterId()))),
        },
      },
    });
    const writers = writerEntities.map((e) => new User(e));

    const likeEntities = await prismaClient.like.findMany({
      where: {
        userId: requester.userId,
        articleId: {
          in: Array.from(new Set(articles.map((a) => a.getId()))),
        },
      },
    });
    const likes = likeEntities.map((e) => new Like(e));

    const hasNext = articles.length === limit + 1;

    return {
      list: articles.slice(0, limit).map((article) => {
        const writer = writers.find((w) => w.getId() === article.getWriterId());
        const like = likes.find((l) => l.getArticleId() === article.getId());

        return {
          id: article.getId(),
          writer: {
            id: writer?.getId() ?? 0,
            nickname: writer?.getNickname() ?? '',
          },
          title: article.getTitle(),
          content: article.getContent(),
          image: article.getImage(),
          createdAt: article.getCreatedAt(),
          isFavorite: !!like,
        };
      }),
      nextCursor: hasNext ? articles[articles.length - 1].getId() : null,
    };
  }
}
