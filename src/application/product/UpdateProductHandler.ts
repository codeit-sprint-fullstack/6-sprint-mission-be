import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Product } from '../../domain/Product';
import { TProductUser } from '@/types/product';

type TUpdateProduct = {
    productId: number;
    name: string | undefined;
    description: string | undefined;
    price: number | undefined;
    tags: string[] | undefined;
    images: string[] | undefined;
}

export class UpdateProductHandler {
    static async handle(requester: TProductUser, { productId, name, description, price, tags, images } : TUpdateProduct) {
        const productEntity = await prismaClient.$transaction(async (tx) => {
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

            return await tx.product.update({
                where: {
                    id: Number(productId),
                },
                data: {
                    name,
                    description,
                    price,
                    tags,
                    images,
                },
            });
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
        };
    }
}
