import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Comment } from '../../domain/Comment';
import { User } from '../../domain/User';
import { Prisma } from '@prisma/client';

type TGetProductCommentList = {
     productId: number;
     cursor?: number | undefined
     limit: number | undefined;
}

export class GetProductCommentListHandler {
    static async handle({ productId, cursor, limit } : TGetProductCommentList) {
        const commentEntities = await prismaClient.$transaction(async (tx) => {
            const targetProductEntity = await tx.product.findUnique({
                where: {
                    id: Number(productId),
                },
            });

            if (!targetProductEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.PRODUCT_NOT_FOUND);
            }

            return await tx.comment.findMany({
                cursor: cursor
                    ? {
                        id: cursor,
                    }
                    : undefined,
                take: Number(limit) + 1,
                where: {
                    productId: Number(productId),
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
        const hasNext = comments.length === Number(limit) + 1;

        return {
            list: comments.slice(0, limit).map((comment) => {
                const writer = writers.find((writer) => writer.getId() === comment.getWriterId());

                if(!writer) {
                    throw new Error('Writer not found');
                }

                return {
                    id: comment.getId(),
                    writer: {
                        id: writer.getId(),
                        nickname: writer.getNickname(),
                        image: writer.getImage(),
                    },
                    productId: comment.getProductId(),
                    content: comment.getContent(),
                    createdAt: comment.getCreatedAt(),
                    updatedAt: comment.getUpdatedAt(),
                };
            }),
            nextCursor: hasNext ? comments[comments.length - 1].getId() : null,
        };
    }
}
