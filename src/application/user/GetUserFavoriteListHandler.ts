import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Product } from '../../domain/Product';

type TGetUserFavoriteListUser = {
    userId: number;
}

type TGetUserFavoriteList = {
    page: number; 
    pageSize: number;
    keyword: string | undefined;
}

export class GetUserFavoriteListHandler {
    static async handle(requester: TGetUserFavoriteListUser, { page, pageSize, keyword }: TGetUserFavoriteList) {
        const userEntity = await prismaClient.user.findUnique({
            where: {
                id: requester.userId,
            },
        });

        if (!userEntity) {
            throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
        }

        const favoriteProductCount = await prismaClient.product.count({
            where: {
                likes: {
                    some: {
                        userId: requester.userId,
                    },
                },
                name: {
                    contains: keyword,
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const favoriteProductsEntities = await prismaClient.product.findMany({
            where: {
                likes: {
                    some: {
                        userId: requester.userId,
                    },
                },
                name: {
                    contains: keyword,
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const favoriteProducts = favoriteProductsEntities.map(
            (favoriteProductEntity) => new Product(favoriteProductEntity),
        );

        return {
            totalCount: favoriteProductCount,
            list: favoriteProducts.map((product) => ({
                id: product.getId(),
                ownerId: product.getOwnerId(),
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                tags: product.getTags(),
                images: product.getImages(),
                createdAt: product.getCreatedAt(),
            })),
        };
    }
}
