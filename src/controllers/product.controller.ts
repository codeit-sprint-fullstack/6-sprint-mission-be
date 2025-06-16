import { RequestHandler } from "express";
import productService from "../services/product.service";
import { AuthenticationError, BadRequestError } from "../types/errors";
import { Product } from "@prisma/client";

type TGetProductsQuery = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};

type TGetProductsResult = [
  {
    likeCount: number;
    productImages: {
      imageUrl: string;
    }[];
    name: string;
    id: number;
    price: number;
    createdAt: Date;
  }[],
  number
];

// 상품 목록 불러오기
const getProducts: RequestHandler<{}, {}, {}, TGetProductsQuery> = async (
  req,
  res,
  next
) => {
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;

  try {
    const [products, totalCount]: TGetProductsResult =
      await productService.getProducts(req.query);

    const productsWithImages = products.map((product) => ({
      ...product,
      productImages: undefined,
      images: product.productImages.map((img) => `${baseUrl}/${img.imageUrl}`),
    }));

    res.status(200).json({ list: productsWithImages, totalCount });
  } catch (e) {
    next(e);
  }
};

// 상품 상세조회
const getProduct: RequestHandler<{ productId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const productId = Number(req.params.productId);
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;

  try {
    const product = await productService.getProduct(userId, productId);

    const imageUrls = product.images.map(
      (imageUrl) => `${baseUrl}/${imageUrl}`
    );

    res.status(200).json({ ...product, images: imageUrls });
  } catch (e) {
    next(e);
  }
};

// 상품 등록
const createProduct: RequestHandler<
  {},
  {},
  Pick<Product, "name" | "description" | "price"> & { tags: string }
> = async (req, res, next) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  if (!req.files) {
    throw new BadRequestError("이미지를 등록해주세요.");
  }

  const userId = req.auth.id;
  const images = req.files;
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;

  try {
    const newProduct = await productService.createProduct(
      userId,
      req.body,
      images as Express.Multer.File[]
    );

    const imageUrls = newProduct.images.map(
      (imageUrl) => `${baseUrl}/${imageUrl}`
    );

    res.status(201).json({ ...newProduct, images: imageUrls });
  } catch (e) {
    next(e);
  }
};

// 상품 수정
const updateProduct: RequestHandler<
  { productId: string },
  {},
  Pick<Product, "name" | "description" | "price"> & { tags: string }
> = async (req, res, next) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  if (!req.files) {
    throw new BadRequestError("이미지를 등록해주세요.");
  }

  const userId = req.auth.id;
  const productId = Number(req.params.productId);
  const images = req.files;
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;

  try {
    const updatedProduct = await productService.updateProduct(
      userId,
      productId,
      req.body,
      images as Express.Multer.File[]
    );

    const imageUrls = updatedProduct.images.map(
      (imageUrl) => `${baseUrl}/${imageUrl}`
    );

    res.status(200).json({ ...updatedProduct, images: imageUrls });
  } catch (e) {
    next(e);
  }
};

// 상품 삭제
const deleteProduct: RequestHandler<{ productId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const productId = Number(req.params.productId);

  try {
    await productService.deleteProduct(userId, productId);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

// 상품 좋아요
const addlikeProduct: RequestHandler<{ productId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const productId = Number(req.params.productId);

  try {
    const like = await productService.addlikeProduct(userId, productId);

    res.status(200).json(like);
  } catch (e) {
    next(e);
  }
};

// 상품 좋아요 취소
const cancelLikeProduct: RequestHandler<{ productId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const productId = Number(req.params.productId);

  try {
    const cancelLike = await productService.cancelLikeProduct(
      userId,
      productId
    );

    res.status(200).json(cancelLike);
  } catch (e) {
    next(e);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addlikeProduct,
  cancelLikeProduct,
};
