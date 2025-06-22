import { prismaClient } from '../../infra/prismaClient.js';

import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ForbiddenException } from '../../exceptions/ForbiddenException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

interface IRequester {
  userId: number;
}

interface ICreateProductLikeDTO {
  productId: number;
}


export class DeleteProductHandler {
    static async handle(requester: {userId: number},
    { productId }: {productId: number}) {
        await prismaClient.$transaction(async (tx) => {
            const targetProductEntity = await tx.product.findUnique({
                where: {
                    id: Number(productId),
                },
            });

            if (!targetProductEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.PRODUCT_NOT_FOUND);
            }

            if (targetProductEntity.ownerId !== requester.userId) {
                throw new ForbiddenException('Forbidden', ExceptionMessage.FORBIDDEN);
            }

            return await tx.product.delete({
                where: {
                    id: Number(productId),
                },
            });
        });
    }
}
