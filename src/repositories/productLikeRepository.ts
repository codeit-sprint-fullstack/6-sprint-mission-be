import { prisma } from "../db/prisma/client.prisma";
import { User, Product } from "@prisma/client";

const create = (userId: User["id"], productId: Product["id"]) => {
  return prisma.productLike.create({
    data: { userId, productId },
  });
};

const deleteLike = (userId: User["id"], productId: Product["id"]) => {
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
