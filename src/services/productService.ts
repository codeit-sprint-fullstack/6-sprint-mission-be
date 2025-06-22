import productRepository from "../repositories/productRepository";
import {
  ProductService,
  CreateProductInput,
  UpdateProductInput,
} from "../types/index";
import { Product } from "@prisma/client";

/**
 * 상품 등록
 */
async function create(product: CreateProductInput): Promise<Product> {
  return await productRepository.createProduct(product);
}

/**
 * 상품 ID로 조회
 */
async function getById(id: number): Promise<any> {
  return await productRepository.getById(id);
}

/**
 * 상품 전체 조회
 */
async function getAll(): Promise<any[]> {
  return await productRepository.getAll();
}

/**
 * 상품 수정
 */
async function updateById(
  id: number,
  product: UpdateProductInput
): Promise<Product> {
  return await productRepository.updateById(id, product);
}

/**
 * 상품 삭제
 */
async function deleteById(id: number): Promise<Product> {
  return await productRepository.deleteById(id);
}

/**
 * 상품 좋아요 추가
 */
async function addLike(userId: number, productId: number): Promise<void> {
  return await productRepository.addLike(userId, productId);
}

/**
 * 상품 좋아요 취소
 */
async function removeLike(userId: number, productId: number): Promise<void> {
  return await productRepository.removeLike(userId, productId);
}

/**
 * 유저가 상품에 좋아요 눌렀는지 확인
 */
async function hasUserLiked(
  userId: number,
  productId: number
): Promise<boolean> {
  return await productRepository.hasUserLiked(userId, productId);
}

const productService: ProductService = {
  create,
  getById,
  getAll,
  updateById,
  deleteById,
  addLike,
  removeLike,
  hasUserLiked,
};

export default productService;
