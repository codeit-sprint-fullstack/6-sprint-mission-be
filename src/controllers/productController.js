import { NotFoundError } from "../exceptions.js";
import productService from "../services/productService.js";

/**
 * 상품 목록 조회
 */
export async function getProducts(req, res, next) {
  try {
    const products = await productService.getProducts({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      orderBy: req.query.orderBy,
      keyword: req.query.keyword,
    });
    res.json(products);
  } catch (e) {
    next(e);
  }
}

/**
 * 상품 등록
 */
export async function createProduct(req, res, next) {
  try {
    const data = req.body;
    const ownerId = req.auth.userId;
    const product = await productService.createProduct(data, ownerId);
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
}

/**
 * 상품 조회
 */
export async function getProduct(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const userId = req.auth.userId;
    const product = await productService.getProduct(productId, userId);
    if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");

    const { owner, ...rest } = product[1];

    res.json({
      ...rest,
      ownerNickname: owner.nickname,
      isFavorite: !!product[0],
    });
  } catch (e) {
    next(e);
  }
}

/**
 * 상품 수정
 */
export async function updateProduct(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const { name, description, price, tags } = req.body;
    const product = await productService.updateProduct(productId, {
      name,
      description,
      price,
      tags,
    });
    if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");
    res.json(product);
  } catch (e) {
    next(e);
  }
}

/**
 * 상품 삭제
 */
export async function deleteProduct(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    if (isNaN(productId)) throw new Error("상품 ID는 숫자여야 합니다.");
    await productService.deleteProduct(productId);
    res.json({ id: productId });
  } catch (e) {
    next(e);
  }
}

/**
 * 상품 좋아요
 */
export async function likeProduct(req, res, next) {
  try {
    const productId = +req.params.productId;
    const userId = req.auth.userId;
    const product = await productService.likeProduct(productId, userId);
    if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");
    res.json({ ...product, isFavorite: true });
  } catch (e) {
    next(e);
  }
}

/**
 * 상품 좋아요 취소
 */
export async function unlikeProduct(req, res, next) {
  try {
    const productId = +req.params.productId;
    const userId = req.auth.userId;
    const product = await productService.unlikeProduct(productId, userId);
    if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");
    res.json({ ...product, isFavorite: false });
  } catch (e) {
    next(e);
  }
}
