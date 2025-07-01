import { RequestHandler } from "express";
import productService from "../services/product.service";
import { AuthenticationError, BadRequestError } from "../types/errors";
import {
  productDto,
  productParamsDto,
  productQueryDto,
} from "../dtos/product.dto";
import { parseProductDto } from "../parsers/product.parser";

// 상품 목록 불러오기
const getProducts: RequestHandler<{}, {}, {}, productQueryDto> = async (
  req,
  res,
  next
) => {
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;

  try {
    const [products, totalCount] = await productService.getProducts(req.query);

    const productsWithImages = products.map(
      ({ productImages, ...product }) => ({
        ...product,
        images: productImages.map((img) => `${baseUrl}/${img.imageUrl}`),
      })
    );

    res.status(200).json({ list: productsWithImages, totalCount });
  } catch (e) {
    next(e);
  }
};

// 상품 상세조회
const getProduct: RequestHandler<productParamsDto> = async (req, res, next) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const createProduct: RequestHandler<{}, {}, productDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

  if (!req.files) throw new BadRequestError("이미지를 등록해주세요.");

  const userId = req.auth.id;
  const images = req.files;
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;
  const body = parseProductDto(req.body);

  try {
    const newProduct = await productService.createProduct(
      userId,
      body,
      images as (Express.Multer.File & { location: string })[]
    );

    // const imageUrls = newProduct.images.map(
    //   (imageUrl) => `${baseUrl}/${imageUrl}`
    // );

    // res.status(201).json({ ...newProduct, images: imageUrls });
    res.status(201).json(newProduct);
  } catch (e) {
    next(e);
  }
};

// 상품 수정
const updateProduct: RequestHandler<productParamsDto, {}, productDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

  if (!req.files) throw new BadRequestError("이미지를 등록해주세요.");

  const userId = req.auth.id;
  const productId = Number(req.params.productId);
  const images = req.files;
  const baseUrl: string = `${req.protocol}://${req.get("host")}/images`;
  const body = parseProductDto(req.body);

  try {
    const updatedProduct = await productService.updateProduct(
      userId,
      productId,
      body,
      images as (Express.Multer.File & { location: string })[]
    );

    // const imageUrls = updatedProduct.images.map(
    //   (imageUrl) => `${baseUrl}/${imageUrl}`
    // );

    // res.status(200).json({ ...updatedProduct, images: imageUrls });
    res.status(200).json(updatedProduct);
  } catch (e) {
    next(e);
  }
};

// 상품 삭제
const deleteProduct: RequestHandler<productParamsDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const addlikeProduct: RequestHandler<productParamsDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const cancelLikeProduct: RequestHandler<productParamsDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
