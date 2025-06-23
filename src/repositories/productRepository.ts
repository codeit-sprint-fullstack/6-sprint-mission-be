import { Product } from "@prisma/client";
import prisma from "../config/prisma";

// 상품 등록
async function create(
  data: Pick<
    Product,
    "name" | "description" | "price" | "tags" | "images" | "ownerId"
  > & { favoriteCount?: number }
) {
  return prisma.product.create({
    data,
  });
}

// 상품 전체 조회
// 페이징 + 정렬 조건에 따른 상품 조회
async function findAll({
  skip,
  take,
  orderBy,
}: {
  skip: number;
  take: number;
  orderBy: { [key: string]: "asc" | "desc" };
}) {
  return prisma.product.findMany({
    skip,
    take,
    orderBy,
  });
}

// 전체 상품 개수 조회
async function count() {
  return prisma.product.count();
}

// 상품 상세 조회 (좋아요 수 및 내가 누른 좋아요 여부 포함)
async function findById(id: Product["id"], userId?: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          nickName: true,
        },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (!product) return null;

  const favoriteCount = await prisma.favorite.count({
    where: { productId: id },
  });

  return {
    ...product,
    favoriteCount,
    isFavorite: userId ? product.favorites.length > 0 : false,
  };
}

// 좋아요 수 증가
async function incrementFavoriteCount(productId: Product["id"]) {
  return prisma.product.update({
    where: { id: productId },
    data: {
      favoriteCount: {
        increment: 1,
      },
    },
  });
}

// 좋아요 수 감소
async function decrementFavoriteCount(productId: Product["id"]) {
  return prisma.product.update({
    where: { id: productId },
    data: {
      favoriteCount: {
        decrement: 1,
      },
    },
  });
}

// 상품 삭제
async function remove(id: Product["id"]) {
  return prisma.product.delete({
    where: { id },
  });
}

// 상품 수정
async function update(
  id: Product["id"],
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export default {
  create,
  findAll,
  findById,
  count,
  remove,
  update,
  incrementFavoriteCount,
  decrementFavoriteCount,
};
