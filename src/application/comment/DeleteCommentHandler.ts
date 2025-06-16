import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

type TDeleteCommentUser = {
    userId : number;
}

type TDeleteComment = {
    commentId: number;
}

export class DeleteCommentHandler {
    static async handle(requester: TDeleteCommentUser, { commentId } : TDeleteComment) {
        await prismaClient.$transaction(async (tx) => {
            const targetCommentEntity = await tx.comment.findUnique({
                where: {
                    id: commentId,
                },
            });

            if (!targetCommentEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.COMMENT_NOT_FOUND);
            }

            if (targetCommentEntity.writerId !== requester.userId) {
                throw new ForbiddenException('Forbidden', ExceptionMessage.FORBIDDEN);
            }

            return await tx.comment.delete({
                where: {
                    id: commentId,
                },
            });
        });
    }
}
