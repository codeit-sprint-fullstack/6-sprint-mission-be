import { Prisma, Product } from '@prisma/client';
import { prismaClient } from '../prismaClient';

// 모든 상품 가져오기
export const FindMany = async ({
    page: cursor = 1,
    pageSize = 10,
    orderBy = 'recent',
    keyword,
}: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    keyword?: string;
}) => {
    const skip = (cursor - 1) * pageSize;
    type StrictWhereClause = {
        name: {
            contains: string;
            mode: 'insensitive';
        };
    };

    const whereClause: StrictWhereClause | {} = keyword
        ? {
              name: {
                  contains: keyword,
                  mode: 'insensitive', // 대소문자 무시
              },
          }
        : {};
    type OrderByClause = { favoriteCount: 'desc' } | { createdAt: 'desc' };
    const orderByClause: OrderByClause =
        orderBy === 'favorite' ? { favoriteCount: 'desc' } : { createdAt: 'desc' }; // 최근순이면 createdAt 기준 내림차순

    const [totalCount, products] = await Promise.all([
        prismaClient.product.count({
            where: whereClause,
        }),
        await prismaClient.product.findMany({
            skip, // 페이지네이션: 앞에서 몇 개 건너뛰기
            take: pageSize, // 몇 개 가져올지
            where: whereClause, // 조건 검색 (예: 키워드)
            orderBy: orderByClause, // 정렬 기준
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                images: true,
                favoriteCount: true,
                ownerId: true,
                ownerNickname: true,
                createdAt: true,
            },
        }),
    ]);

    return {
        totalCount,
        list: products,
    };
};

// id 값으로 상품 하나 가져오기
export const FindById = async (id: number) => {
    const product = await prismaClient.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            images: true,
            favoriteCount: true,
            isFavorite: true,
            ownerId: true,
            ownerNickname: true,
            createdAt: true,
        },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};

// 새 상품 추가하기
export const Create = async (
    data: Pick<
        Product,
        'description' | 'name' | 'price' | 'tags' | 'images' | 'ownerNickname' | 'ownerId'
    >,
) => {
    return prismaClient.product.create({ data });
};

// 상품 정보 수정하기/
export const Update = async (id: number, data: Product) => {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.product.findUnique({ where: { id } });
        if (!exists) throw new Error('Product not found');

        return tx.product.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                images: true,
                favoriteCount: true,
                isFavorite: true,
                ownerId: true,
                ownerNickname: true,
                createdAt: true,
            },
        });
    });
};

export const Delete = async (id: number) => {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.product.findUnique({ where: { id } });
        if (!exists) throw new Error('Product not found');
        return tx.product.delete({ where: { id } });
    });
};

export const toggleLike = async (userId: number, productId: number) => {
    return prismaClient.$transaction(async (tx) => {
        const existing = await tx.myLikes.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });

        if (existing) {
            // 좋아요 취소
            await tx.myLikes.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });

            await tx.product.update({
                where: { id: productId },
                data: { favoriteCount: { decrement: 1 } },
            });

            return { liked: false };
        } else {
            // 좋아요 추가
            await tx.myLikes.create({
                data: {
                    userId,
                    productId,
                    type: 'product',
                    tableId: productId,
                },
            });

            await tx.product.update({
                where: { id: productId },
                data: { favoriteCount: { increment: 1 } },
            });

            return { liked: true };
        }
    });
};
