import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Comment } from '../../domain/Comment';
import { User } from '../../domain/User';
import { TProduct, TProductUser } from '@/types/product';

type TCreateProductComment = {
    productId: number;
    content: string;
}

export class CreateProductCommentHandler {
    static async handle(
        requester : TProductUser,
        { productId, content } : TCreateProductComment
    ) {
        const commentEntity = await prismaClient.$transaction(async (tx) => {
            const targetProductEntity = await tx.product.findUnique({
                where: {
                    id: productId,
                },
            });

            if (!targetProductEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.PRODUCT_NOT_FOUND);
            }

            return await tx.comment.create({
                data: {
                    productId: productId,
                    writerId: requester.userId,
                    content,
                },
            });
        });

        const comment = new Comment(commentEntity);

        const writerEntity = await prismaClient.user.findUnique({
            where: {
                id: comment.getWriterId(),
            },
        });

        if(!writerEntity) {
            throw new Error('User Not Found')
        }
        
        const writer = new User(writerEntity);

        return {
            id: comment.getId(),
            writer: {
                id: writer.getId(),
                nickname: writer.getNickname(),
                image: writer.getImage(),
            },
            content: comment.getContent(),
            createdAt: comment.getCreatedAt(),
        };
    }
}
