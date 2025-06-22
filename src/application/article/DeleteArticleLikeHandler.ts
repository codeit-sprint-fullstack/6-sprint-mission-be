import { prismaClient } from '../../infra/prismaClient.js';
import { Article } from '../../domain/Article.js';
import { User } from '../../domain/User.js';

import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

interface IRequester {
  userId: number;
}

interface IDeleteArticleLikeDTO {
  articleId: number;
}

export class DeleteArticleLikeHandler {
  static async handle(
    requester: IRequester,
    { articleId }: IDeleteArticleLikeDTO
  ) {
    const articleEntity = await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: { id: articleId },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      const likeEntity = await tx.like.findUnique({
        where: {
          userId_articleId: {
            userId: requester.userId,
            articleId,
          },
        },
      });

      if (likeEntity) {
        await tx.like.delete({
          where: {
            userId_articleId: {
              userId: requester.userId,
              articleId,
            },
          },
        });
      }

      return targetArticleEntity;
    });

    const article = new Article({
      ...articleEntity,
      likes: [], // 좋아요 목록이 없을 경우 기본값으로 처리
    });

    const writerEntity = await prismaClient.user.findUnique({
      where: {
        id: articleEntity.writerId,
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
      isFavorite: false,
    };
  }
}
