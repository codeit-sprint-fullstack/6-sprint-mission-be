import { prismaClient } from '../../infra/prismaClient.js';
import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ForbiddenException } from '../../exceptions/ForbiddenException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

interface IRequester {
  userId: number;
}

interface IDeleteArticleDTO {
  articleId: number;
}

export class DeleteArticleHandler {
  static async handle(requester: IRequester, { articleId }: IDeleteArticleDTO): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: { id: articleId },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      if (targetArticleEntity.writerId !== requester.userId) {
        throw new ForbiddenException('Forbidden', ExceptionMessage.FORBIDDEN);
      }

      await tx.article.delete({
        where: { id: articleId },
      });
    });
  }
}
