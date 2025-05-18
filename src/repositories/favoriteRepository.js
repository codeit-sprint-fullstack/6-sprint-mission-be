import prisma from "../config/prisma.js";

// 좋아요 여부 확인
async function isFavorite(userId, productId) {
  return prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

// 좋아요 추가
async function addFavorite(userId, productId) {
  return prisma.favorite.create({
    data: {
      userId,
      productId,
    },
  });
}

// 좋아요 제거
async function removeFavorite(userId, productId) {
  return prisma.favorite.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export default {
  isFavorite,
  addFavorite,
  removeFavorite,
};
