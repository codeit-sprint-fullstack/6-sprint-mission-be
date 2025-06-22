import { prismaClient } from '../../infra/prismaClient.js';
import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

import { Comment } from '../../domain/Comment.js';
import { User } from '../../domain/User.js';

interface IGetArticleCommentListDTO {
  articleId: number;
  cursor?: number;
  take: number;
}

export class GetArticleCommentListHandler {
  static async handle({ articleId, cursor, take }: IGetArticleCommentListDTO) {
    const comments = await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: { id: articleId },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      return await tx.comment.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: take + 1,
        orderBy: { id: 'asc' },
        where: { articleId },
      });
    });

    const commentInstances = comments.map((entity) => new Comment(entity));

    const writerIds = Array.from(new Set(commentInstances.map((c) => c.getWriterId())));
    const writerEntities = await prismaClient.user.findMany({
      where: { id: { in: writerIds } },
    });
    const writers = writerEntities.map((entity) => new User(entity));

    const hasNext = commentInstances.length > take;
    const limitedComments = commentInstances.slice(0, take);

    return {
      data: limitedComments.map((comment) => {
        const writer = writers.find((w) => w.getId() === comment.getWriterId());
        if (!writer) throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);

        return {
          id: comment.getId(),
          writer: {
            id: writer.getId(),
            nickname: writer.getNickname(),
            image: writer.getImage(),
          },
          articleId: comment.getArticleId(),
          content: comment.getContent(),
          createdAt: comment.getCreatedAt(),
        };
      }),
      hasNext,
      nextCursor: hasNext ? limitedComments[limitedComments.length - 1].getId() : null,
    };
  }
}
