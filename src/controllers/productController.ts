import { ExceptionMessage } from "../ExceptionMessage";
import { NotFoundError } from "../types/exceptions";
import { NextFunction, Request, Response } from "express";
import productService from "../services/productService";

interface ProductQuery {
  page?: string;
  pageSize?: string;
  orderBy: "recent" | "favorite";
  keyword?: string;
}

// 상품 목록 조회
export async function getProducts(
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await productService.getProducts({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      orderBy: req.query.orderBy,
      keyword: req.query.keyword,
    });
    res.json({ totalCount: products.length, list: products });
  } catch (e) {
    next(e);
  }
}

// 상품 등록
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const ownerId = req.auth.userId;
    const product = await productService.createProduct(data, ownerId);
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
}

// 상품 조회
export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);
    const userId = req.auth.userId;
    const [favorite, product] = await productService.getProduct(
      productId,
      userId
    );
    if (!product) {
      throw new NotFoundError(ExceptionMessage.PRODUCT_NOT_FOUND);
    }
    const { owner, ...rest } = product;
    res.json({
      ...rest,
      ownerNickname: owner.nickname,
      isFavorite: !!favorite,
    });
  } catch (e) {
    next(e);
  }
}

// 상품 수정
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);
    const data = req.body;
    const product = await productService.updateProduct(productId, data);
    res.json(product);
  } catch (e) {
    next(e);
  }
}

// 상품 삭제
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);
    await productService.deleteProduct(productId);
    res.json({ id: productId });
  } catch (e) {
    next(e);
  }
}

// 상품 좋아요
export async function likeProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);
    const userId = req.auth.userId;
    const product = await productService.likeProduct(productId, userId);
    res.json({ ...product, isFavorite: true });
  } catch (e) {
    next(e);
  }
}

// 상품 좋아요 취소
export async function unlikeProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);
    const userId = req.auth.userId;
    const product = await productService.unlikeProduct(productId, userId);
    res.json({ ...product, isFavorite: false });
  } catch (e) {
    next(e);
  }
}
