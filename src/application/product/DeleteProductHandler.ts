import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';
import { TProduct, TProductUser } from '@/types/product';

type TDeleteProduct = {
    productId: number;
}


export class DeleteProductHandler {
    static async handle(requester : TProductUser, { productId } : TDeleteProduct) {
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
