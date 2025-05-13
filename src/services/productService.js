import { HttpError } from '../middlewares/HttpError.js';
import * as productRepository from '../repositories/productRepository.js';
import * as commentRepository from '../repositories/commentRepository.js';

export const getProducts = async ({ cursor, take, orderBy, word }) => {
    const { list, totalCount } = await productRepository.FindMany({ cursor, take, orderBy, word });
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

export const getProduct = async (id) => {
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

export const createProduct = async (userId, userNickname, data) => {
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
export const updateProduct = async (id, userId, data) => {
    const entity = await productRepository.FindById(id);
    if (!entity) throw new HttpError(404, '상품이 존재하지 않습니다');

    if (entity.ownerId !== userId) {
        throw new HttpError(403, '수정 권한이 없습니다');
    }

    const updated = await productRepository.Update(id, data);
    return updated;
};

export const deleteProduct = async (id, userId) => {
    const entity = await productRepository.FindById(id);
    if (!entity) throw new HttpError(404, '상품이 존재하지 않습니다');

    if (entity.ownerId !== userId) {
        throw new HttpError(403, '삭제 권한이 없습니다');
    }

    await productRepository.Delete(id);
};

export const toggleLike = async (productId, userId) => {
    const result = await productRepository.toggleLike(userId, productId);
    return result;
};
