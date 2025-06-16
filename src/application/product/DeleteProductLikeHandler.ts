import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Product } from '../../domain/Product';
import { TProduct, TProductUser } from '@/types/product';

type TDeleteProductLike = {
    productId: number;
}

export class DeleteProductLikeHandler {
    static async handle(requester : TProductUser, { productId }: TDeleteProductLike) {
        const productEntity = await prismaClient.$transaction(async (tx) => {
            const targetProductEntity = await tx.product.findUnique({
                where: {
                    id: productId,
                },
            });

            if (!targetProductEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.PRODUCT_NOT_FOUND);
            }

            const likeEntity = await tx.like.findUnique({
                where: {
                    userId_productId: {
                        userId: requester.userId,
                        productId,
                    },
                },
            });

            if (likeEntity) {
                await tx.like.delete({
                    where: {
                        userId_productId: {
                            userId: requester.userId,
                            productId,
                        },
                    },
                });
            }

            return targetProductEntity;
        });

        const product = new Product(productEntity);

        return {
            id: product.getId(),
            ownerId: product.getOwnerId(),
            name: product.getName(),
            description: product.getDescription(),
            price: product.getPrice(),
            tags: product.getTags(),
            images: product.getImages(),
            createdAt: product.getCreatedAt(),
            isFavorite: false,
        };
    }
}
