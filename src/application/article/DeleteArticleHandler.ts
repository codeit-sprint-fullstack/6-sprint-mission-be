import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';
import { TArticle, TArticleUser } from '@/types/article';

type TDeleteArticle = {
    articleId: number;
}

export class DeleteArticleHandler {
    static async handle(requester: TArticleUser, { articleId } : TDeleteArticle) {
        await prismaClient.$transaction(async (tx) => {
            const targetArticleEntity = await tx.article.findUnique({
                where: {
                    id: articleId,
                },
            });

            if (!targetArticleEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
            }

            if (targetArticleEntity.writerId !== requester.userId) {
                throw new ForbiddenException('Forbidden', ExceptionMessage.FORBIDDEN);
            }

            return await tx.article.delete({
                where: {
                    id: articleId,
                },
            });
        });
    }
}
