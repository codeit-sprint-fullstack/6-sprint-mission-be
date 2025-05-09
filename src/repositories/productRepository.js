import { prismaClient } from '../prismaClient.js';

// 모든 상품 가져오기
export const FindMany = async ({ page = 1, pageSize = 10, orderBy = 'recent', keyword }) => {
    const skip = (page - 1) * pageSize;

    const whereClause = keyword
        ? {
              name: {
                  contains: keyword,
                  mode: 'insensitive', // 대소문자 무시
              },
          }
        : {};

    const orderByClause =
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
export const FindById = async (id) => {
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
export const Create = async (data) => {
    return prismaClient.product.create({ data });
};

// 상품 정보 수정하기
export const Update = async (id, data) => {
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

export const Delete = async (id) => {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.product.findUnique({ where: { id } });
        if (!exists) throw new Error('Product not found');
        return tx.product.delete({ where: { id } });
    });
};

export const LikeAdd = async (id) => {};

export const LikeDelete = async (id) => {};
