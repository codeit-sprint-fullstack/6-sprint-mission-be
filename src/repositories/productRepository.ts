import prisma from "../db/prisma/client";
import {
  ProductRepository,
  CreateProductInput,
  UpdateProductInput,
} from "../types/index";
import { Product } from "@prisma/client";

/**
 * 상품 등록
 */
async function createProduct(product: CreateProductInput): Promise<Product> {
  console.log(product);
  const createdProduct = await prisma.product.create({
    data: {
      name: product.name,
      description: product.description || "",
      price: product.price,
      tags: product.tags ? product.tags : [],
      images: product.images || null,
      author: {
        connect: {
          id: product.authorId,
        },
      },
    },
  });
  return createdProduct;
}

/**
 * 상품 ID로 조회
 */
async function getById(id: number): Promise<any> {
  const getProduct = await prisma.product.findUnique({
    where: { id: parseInt(id.toString(), 10) },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
      Comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
            },
          },
        },
      },
    },
  });
  return getProduct;
}

/**
 * 상품 전체 조회
 */
async function getAll(): Promise<any[]> {
  const getAllProducts = await prisma.product.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return getAllProducts;
}

/**
 * 상품 수정
 */
async function updateById(
  id: number,
  product: UpdateProductInput
): Promise<Product> {
  const updatedProduct = await prisma.product.update({
    where: {
      id: parseInt(id.toString(), 10),
    },
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images ? product.images : null,
    },
  });
  return updatedProduct;
}

/**
 * 상품 삭제
 */
async function deleteById(id: number): Promise<Product> {
  const deletedProduct = await prisma.product.delete({
    where: {
      id: parseInt(id.toString(), 10),
    },
  });
  return deletedProduct;
}

/**
 * 상품 좋아요 추가
 */
async function addLike(userId: number, productId: number): Promise<void> {
  await prisma.productLike.create({
    data: { userId, productId },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { favoriteCount: { increment: 1 } },
  });
}

/**
 * 상품 좋아요 취소
 */
async function removeLike(userId: number, productId: number): Promise<void> {
  await prisma.productLike.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { favoriteCount: { decrement: 1 } },
  });
}

/**
 * 유저가 상품에 좋아요 눌렀는지 확인
 */
async function hasUserLiked(
  userId: number,
  productId: number
): Promise<boolean> {
  const like = await prisma.productLike.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });
  return !!like;
}

const productRepository: ProductRepository = {
  createProduct,
  getById,
  getAll,
  updateById,
  deleteById,
  addLike,
  removeLike,
  hasUserLiked,
};

export default productRepository;
