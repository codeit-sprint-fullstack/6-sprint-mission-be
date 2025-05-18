import prisma from '../db/prisma/client.prisma.js';

// 즐겨찾기 추가
export const createFavorite = (userId, productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return prisma.favorite.create({
    data: {
      user: {
        connect: { id: userId },
      },
      product: {
        connect: { id: productId },
      },
    },
  });
};


// 즐겨찾기 삭제
export const deleteFavorite = (userId, productId) => {
  return prisma.favorite.delete({
    where: {
      userId_productId: {  
        userId,
        productId,
      },
    },
  });
};

// 특정 사용자의 즐겨찾기 목록 조회
export const getFavoritesByUser = (userId) => {
  return prisma.favorite.findMany({
    where: { userId },
    include: { product: true },  
  });
};
