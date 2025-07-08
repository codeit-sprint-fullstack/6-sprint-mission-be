import prisma from "../db/prisma/client.prisma";

export const createFavorite = async (userId: number, productId: number) => {
  return await prisma.favorite.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
    },
  });
};

export const deleteFavorite = async (userId: number, productId: number) => {
  return await prisma.favorite.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const getFavoritesByUser = async (userId: number) => {
  return await prisma.favorite.findMany({
    where: { userId },
    include: { product: true },
  });
};
