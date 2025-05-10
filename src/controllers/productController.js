import { NotFoundError } from "../exceptions.js";
import productService from "../services/productService.js";

/**
 * 상품 목록 조회
 */
export async function getProducts(req, res, next) {
  try {
    const products = await productService.findProducts({
      offset: Number(req.query.offset),
      search: req.query.search,
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
    const { name, description, price, tags } = req.body;
    const ownerId = req.auth.userId;
    const product = await productService.createProduct(
      {
        name,
        description,
        price,
        tags,
      },
      ownerId
    );
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
    const product = await productService.findProductById(productId, userId);
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
    if (!productId) throw new NotFoundError("상품을 찾을 수 없습니다.");

    const { name, description, price, tags } = req.body;
    const product = await productService.updateProductById(productId, {
      name,
      description,
      price,
      tags,
    });
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
    if (!productId) throw new NotFoundError("상품을 찾을 수 없습니다.");
    await productService.deleteProductById(productId);
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
    const product = await productService.likeProductById(productId, userId);
    if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");
    res.json({ ...product[1], isFavorite: true });
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
    const product = await productService.unlikeProductById(productId, userId);
    if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");
    res.json({ ...product[1], isFavorite: false });
  } catch (e) {
    next(e);
  }
}
