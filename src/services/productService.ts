import productRepository from "../repositories/productRepository";
import prisma from "../config/prisma";
import { Prisma, Product } from "@prisma/client";

export async function createProduct(
  data: Prisma.ProductCreateInput
): Promise<Product> {
  return productRepository.create(data);
}

// 전체 상품 조회 (정렬 옵션 포함)
export async function getAllProductsWithLikes(
  userId?: number,
  sortBy: string = "latest"
) {
  // 모든 상품 가져오기 (정렬은 메모리에서 함)
  const products = await prisma.product.findMany({
    include: {
      likes: true,
    },
  });

  // 상품 데이터 가공
  const processed = products.map((product) => ({
    ...product,
    isLiked: userId
      ? product.likes.some((like) => like.userId === userId)
      : false,
    likeCount: product.likes.length,
  }));

  return sortBy === "likes"
    ? processed.sort((a, b) => b.likeCount - a.likeCount)
    : processed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// 베스트 상품 조회 (좋아요 많은 순 상위 N개)
export async function getBestProducts(userId: number, limit = 4) {
  // 모든 상품 가져오기
  const products = await prisma.product.findMany({
    include: {
      likes: true,
    },
  });

  // 상품 데이터 가공 및 좋아요 순 정렬 후 상위 N개 선택
  return products
    .map((product) => ({
      ...product,
      isLiked: userId
        ? product.likes.some((like) => like.userId === userId)
        : false,
      likeCount: product.likes.length,
    }))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
}

export async function getProductById(id: number, userId?: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      owner: {
        // 상품 소유자 정보 포함
        select: {
          id: true,
          nickname: true,
          email: true,
        },
      },
      likes: { select: { userId: true } },
      comments: {
        include: {
          user: {
            // 댓글 작성자 정보 포함
            select: {
              id: true,
              nickname: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product) return null;

  // 응답 데이터 가공
  return {
    ...product,
    // 소유자 정보 추가
    ownerNickname: product.owner.nickname,
    ownerEmail: product.owner.email,
    // 다른 필드들 추가
    likeCount: product.likes.length,
    isLiked: userId
      ? product.likes.some((like) => like.userId === userId)
      : false,
    // 댓글 목록 가공
    comments: product.comments.map((comment) => ({
      ...comment,
      authorNickname: comment.user.nickname,
    })),
  };
}

export async function updateProduct({
  id,
  userId,
  data,
}: {
  id: number;
  userId: number;
  data: Prisma.ProductUpdateInput;
}): Promise<Product> {
  const product = await productRepository.findById(id);
  if (!product || product.ownerId !== userId) {
    const err = new Error("수정 권한이 없습니다.") as Error & { code?: number };
    err.code = 403;
    throw err;
  }

  return productRepository.update(id, data);
}

export async function deleteProduct(
  id: number,
  userId: number
): Promise<Product> {
  const product = await productRepository.findById(id);
  if (!product || product.ownerId !== userId) {
    const err = new Error("삭제 권한이 없습니다.") as Error & { code?: number };
    err.code = 403;
    throw err;
  }

  return productRepository.remove(id);
}

export async function likeProduct(
  productId: number,
  userId: number
): Promise<{ message: string }> {
  return await prisma.$transaction(async (tx) => {
    const alreadyLiked = await tx.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (alreadyLiked) {
      const err = new Error("이미 좋아요를 누르셨습니다.") as Error & {
        code?: number;
      };
      err.code = 409;
      throw err;
    }

    await tx.like.create({
      data: { userId, productId },
    });

    return { message: "좋아요 완료" };
  });
}

export async function unlikeProduct(
  productId: number,
  userId: number
): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    await tx.like.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return;
  });
}

export default {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  getAllProductsWithLikes,
  getBestProducts,
};
