import { prismaClient } from '../../infra/prismaClient.js';
import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

import { Article } from '../../domain/Article.js';
import { User } from '../../domain/User.js';

interface IRequester {
  userId: number;
}

interface IGetArticleDTO {
  articleId: string | number;
}

export class GetArticleHandler {
  static async handle(requester: IRequester, { articleId }: IGetArticleDTO) {
    const numericArticleId = Number(articleId);

    const articleEntity = await prismaClient.article.findUnique({
      where: {
        id: numericArticleId,
      },
      include: {
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!articleEntity) {
      throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
    }

    const article = new Article(articleEntity);

    const writerEntity = await prismaClient.user.findUnique({
      where: {
        id: article.getWriterId(),
      },
    });

    if (!writerEntity) {
      throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
    }

    const writer = new User(writerEntity);

    return {
      id: article.getId(),
      writer: {
        id: writer.getId(),
        nickname: writer.getNickname(),
      },
      title: article.getTitle(),
      content: article.getContent(),
      image: article.getImage(),
      createdAt: article.getCreatedAt(),
      favoriteCount: article.getFavoriteCount(),
      isFavorite: article.getIsFavorite(requester.userId),
    };
  }
}
