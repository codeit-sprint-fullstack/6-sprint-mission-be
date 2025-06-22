import { prismaClient } from '../../infra/prismaClient.js';
import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ForbiddenException } from '../../exceptions/ForbiddenException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

import { Article } from '../../domain/Article.js';
import { User } from '../../domain/User.js';

interface IRequester {
  userId: number;
}

interface IUpdateArticleDTO {
  articleId: number;
  title?: string;
  content?: string;
  image?: string | null;
}

export class UpdateArticleHandler {
  static async handle(
    requester: IRequester,
    { articleId, title, content, image }: IUpdateArticleDTO
  ) {
    const articleEntity = await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: { id: articleId },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      if (targetArticleEntity.writerId !== requester.userId) {
        throw new ForbiddenException('Forbidden', ExceptionMessage.FORBIDDEN);
      }

      return await tx.article.update({
        where: { id: articleId },
        data: { title, content, image },
      });
    });

    const article = new Article({ ...articleEntity, likes: [] });

    const writerEntity = await prismaClient.user.findUnique({
      where: { id: article.getWriterId() },
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
      updatedAt: article.getUpdatedAt(),
    };
  }
}
