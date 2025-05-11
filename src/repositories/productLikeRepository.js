import { prisma } from "../db/prisma/client.prisma.js";

const create = (userId, productId) => {
  return prisma.productLike.create({
    data: { userId, productId },
  });
};

const deleteLike = (userId, productId) => {
  return prisma.productLike.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });
};

export default {
  create,
  delete: deleteLike,
};
