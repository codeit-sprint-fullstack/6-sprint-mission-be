import { Product, User } from '@prisma/client';
import { HttpError } from '../middlewares/HttpError.js';
import * as productRepository from '../repositories/productRepository.js';

export const getProducts = async ({
    page,
    pageSize,
    orderBy,
    keyword,
}: {
    page: number;
    pageSize: number;
    orderBy?: string;
    keyword?: string;
}) => {
    const take = pageSize; // ✅ 추가
    const { list, totalCount } = await productRepository.FindMany({
        page,
        pageSize: take,
        orderBy,
        keyword,
    });

    const hasNext = list.length === take + 1;

    return {
        data: list.slice(0, take).map((a) => ({
            id: a.id,
            name: a.name,
            description: a.description,
            price: a.price,
            tags: a.tags,
            images: a.images,
            favoriteCount: a.favoriteCount,
            ownerId: a.ownerId,
            ownerNickname: a.ownerNickname,
            createdAt: a.createdAt,
        })),
        hasNext,
        nextCursor: hasNext ? list[take].id : null,
        totalCount,
    };
};

export const getProduct = async (id: number) => {
    const entity = await productRepository.FindById(id);
    if (!entity) throw new HttpError(404, '상품이 존재하지 않습니다');

    return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        price: entity.price,
        tags: entity.tags,
        images: entity.images,
        favoriteCount: entity.favoriteCount,
        isFavorite: entity.isFavorite,
        ownerId: entity.ownerId,
        ownerNickname: entity.ownerNickname,
        createdAt: entity.createdAt,
    };
};

export const createProduct = async (
    userId: User['id'],
    userNickname: User['nickname'],
    data: Pick<
        Product,
        'description' | 'name' | 'price' | 'tags' | 'images' | 'ownerNickname' | 'ownerId'
    >,
) => {
    const entity = await productRepository.Create({
        ...data,
        ownerId: userId,
        ownerNickname: userNickname,
    });

    return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        price: entity.price,
        tags: entity.tags,
        images: entity.images,
        favoriteCount: entity.favoriteCount,
        ownerId: entity.ownerId,
        ownerNickname: entity.ownerNickname,
        createdAt: entity.createdAt,
    };
}; //
export const updateProduct = async (id: number, userId: number, data: Product) => {
    const entity = await productRepository.FindById(id);
    if (!entity) throw new HttpError(404, '상품이 존재하지 않습니다');

    if (entity.ownerId !== userId) {
        throw new HttpError(403, '수정 권한이 없습니다');
    }

    const updated = await productRepository.Update(id, data);
    return updated;
};

export const deleteProduct = async (id: number, userId: number) => {
    const entity = await productRepository.FindById(id);
    if (!entity) throw new HttpError(404, '상품이 존재하지 않습니다');

    if (entity.ownerId !== userId) {
        throw new HttpError(403, '삭제 권한이 없습니다');
    }

    await productRepository.Delete(id);
};

export const toggleLike = async (productId: number, userId: number) => {
    const result = await productRepository.toggleLike(userId, productId);
    return result;
};
