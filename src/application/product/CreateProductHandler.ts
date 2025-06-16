import { prismaClient } from '../../infra/prismaClient';

import { Product } from '../../domain/Product';
import { Prisma } from '@prisma/client';
import { TProduct, TProductUser } from '@/types/product';

type TCreateProduct = {
    name: string; 
    description: string; 
    price: number; 
    tags?: string[] | undefined; 
    images : string[] | Prisma.ProductCreateimagesInput | undefined; 
}
export class CreateProductHandler {
    static async handle(requester: TProductUser, { name, description, price, tags, images } : TCreateProduct) {
        const productEntity = await prismaClient.product.create({
            data: {
                ownerId: requester.userId,
                name,
                description,
                price,
                tags,
                images,
            },
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
