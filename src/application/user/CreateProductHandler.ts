import { prismaClient } from '../../infra/prismaClient';

import { Product } from '../../domain/Product';

interface IRequester {
  userId: number;
}

interface ICreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export class CreateProductHandler {
    static async handle(requester: IRequester,
    { name, description, price, tags, images }: ICreateProductDTO) {
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
