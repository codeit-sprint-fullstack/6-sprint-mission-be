import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Comment } from '../../domain/Comment';
import { User } from '../../domain/User';

type TGetArticleCommentList = {
    articleId: number;
    cursor?: number | undefined;
    take?: number | undefined;
}

export class GetArticleCommentListHandler {
    static async handle({ articleId, cursor, take } : TGetArticleCommentList) {
        const commentEntities = await prismaClient.$transaction(async (tx) => {
            const targetArticleEntity = await tx.article.findUnique({
                where: {
                    id: articleId,
                },
            });

            if (!targetArticleEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
            }

            return await tx.comment.findMany({
                cursor: cursor
                    ? {
                          id: cursor,
                      }
                    : undefined,
                take: Number(take) + 1,
                where: {
                    articleId: articleId,
                },
            });
        });


        const comments = commentEntities.map((commentEntity) => new Comment(commentEntity));

        const writerEntities = await prismaClient.user.findMany({
            where: {
                id: {
                    in: Array.from(new Set(comments.map((comment) => comment.getWriterId()))),
                },
            },
        });

        const writers = writerEntities.map((writerEntity) => new User(writerEntity));

        const hasNext = comments.length === Number(take) + 1;

        return {
            data: comments.slice(0, take).map((comment) => {
                const writer = writers.find((writer) => writer.getId() === comment.getWriterId());

                if (!writer) {
                    throw new Error('Writer not found');
                }
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
            nextCursor: hasNext ? comments[comments.length - 1].getId() : null,
        };
    }
}
