import * as productService from '../services/productService';
import { HttpError } from '../middlewares/HttpError';
import { NextFunction, Request, Response } from 'express';

function validateProductData(data: {
    description: string;
    name: string;
    price: number;
    tags: string[];
    images: string[];
    ownerNickname: string;
    ownerId: number;
}) {
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

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = '1', pageSize = '10', orderBy, word } = req.query;

        const products = await productService.getProducts({
            page: parseInt(page as string, 10),
            pageSize: parseInt(pageSize as string, 10),
            orderBy: orderBy as string | undefined,
            keyword: word as string | undefined,
        });

        res.json(products);
    } catch (err) {
        next(err);
    }
};
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProduct(Number(req.params.productId));
        res.json(product);
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const userNickname = req.userNickname;

        validateProductData(req.body);

        const newProduct = await productService.createProduct(userId!, userNickname!, req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const productId = Number(req.params.productId);

        validateProductData(req.body);

        const updatedProduct = await productService.updateProduct(productId, userId!, req.body);
        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const productId = Number(req.params.productId);

        await productService.deleteProduct(productId, userId!);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const productId = Number(req.params.productId);

        const result = await productService.toggleLike(productId, userId!);

        res.status(200).json({
            liked: result.liked, // 좋아요 여부
            // favoriteCount: result.favoriteCount, // 현재 좋아요 수
        });
    } catch (err) {
        next(err);
    }
};

export const uploadProductImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            res.status(400).json({ message: '이미지가 없습니다' });
        }

        const files = req.files as Express.Multer.File[]; // ✅ 타입 단언
        const imageUrls = files.map((file) => `/uploads/${file.filename}`);

        res.status(200).json({ imageUrls });
    } catch (err) {
        next(err);
    }
};
