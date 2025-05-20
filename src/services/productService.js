import productRepository from "../repositories/productRepository.js";
import prisma from "../config/prisma.js";

export async function createProduct(data) {
  return productRepository.create(data);
}

// 전체 상품 조회 (정렬 옵션 포함)
export async function getAllProductsWithLikes(userId, sortBy = "latest") {
  // 기본 include 옵션
  const include = {
    likes: true,
  };

  // 모든 상품 가져오기 (정렬은 메모리에서 함)
  const products = await prisma.product.findMany({
    include,
  });

  // 상품 데이터 가공
  const processedProducts = products.map((product) => ({
    ...product,
    isLiked: userId
      ? product.likes.some((like) => like.userId === userId)
      : false,
    likeCount: product.likes.length,
  }));

  // 정렬 적용
  if (sortBy === "likes") {
    // 좋아요 많은 순 정렬
    return processedProducts.sort((a, b) => b.likeCount - a.likeCount);
  } else {
    // 기본 최신순 정렬
    return processedProducts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

// 베스트 상품 조회 (좋아요 많은 순 상위 N개)
export async function getBestProducts(userId, limit = 4) {
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

export async function getProductById(id, userId) {
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

export async function updateProduct({ id, userId, data }) {
  const product = await productRepository.findById(id);
  if (!product || product.ownerId !== userId) {
    const err = new Error("수정 권한이 없습니다.");
    err.code = 403;
    throw err;
  }

  return productRepository.update(id, data);
}

export async function deleteProduct(id, userId) {
  const product = await productRepository.findById(id);
  if (!product || product.ownerId !== userId) {
    const err = new Error("삭제 권한이 없습니다.");
    err.code = 403;
    throw err;
  }

  return productRepository.remove(id);
}

export async function likeProduct(productId, userId) {
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
      const err = new Error("이미 좋아요를 누르셨습니다.");
      err.code = 409;
      throw err;
    }

    await tx.like.create({
      data: { userId, productId },
    });

    return { message: "좋아요 완료" };
  });
}

export async function unlikeProduct(productId, userId) {
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
