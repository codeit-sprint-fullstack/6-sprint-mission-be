import { prismaClient } from '../../infra/prismaClient.js';

import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

import { Comment } from '../../domain/Comment.js';
import { User } from '../../domain/User.js';

interface IRequester {
  userId: number;
}

interface ICreateProductCommentDTO {
  productId: number;
  content: string;
}

export class CreateProductCommentHandler {
    static async handle( requester: IRequester,
    { productId, content }: ICreateProductCommentDTO) {
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

        if (!writerEntity) {
          throw new Error('Writer not found'); // 혹은 적절한 예외 처리
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
