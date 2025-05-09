import * as productService from '../services/productService.js';
import { HttpError } from '../middlewares/HttpError.js';

function validateProductData(data) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        throw new HttpError(400, '상품 이름은 필수입니다');
    }

    if (typeof data.price !== 'number' || data.price < 0) {
        throw new HttpError(400, '상품 가격은 0 이상의 숫자여야 합니다');
    }

    if (
        !data.description ||
        typeof data.description !== 'string' ||
        data.description.trim() === ''
    ) {
        throw new HttpError(400, '상품 설명은 필수입니다');
    }

    if (!Array.isArray(data.tags) || data.tags.length === 0) {
        throw new HttpError(400, '상품 태그는 하나 이상 포함해야 합니다');
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts(req.query);
        res.json(products);
    } catch (err) {
        next(err);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProduct(Number(req.params.productId));
        res.json(product);
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userNickname = req.userNickname;

        validateProductData(req.body);

        const newProduct = await productService.createProduct(userId, userNickname, req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const userId = req.userId;
        const productId = Number(req.params.productId);

        validateProductData(req.body);

        const updatedProduct = await productService.updateProduct(productId, userId, req.body);
        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const userId = req.userId;
        const productId = Number(req.params.productId);

        await productService.deleteProduct(productId, userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const likeProduct = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);
        await productService.LikeAdd(productId);
        res.status(200).json({ message: '좋아요 추가 완료' });
    } catch (err) {
        next(err);
    }
};

export const unlikeProduct = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);
        await productService.LikeDelete(productId);
        res.status(200).json({ message: '좋아요 제거 완료' });
    } catch (err) {
        next(err);
    }
};
