import { prisma } from "../db/prisma/client.prisma";
import { UserParamsDto } from "../dtos/user.dto";
import { ProductParamsDto } from "../dtos/product.dto";

const create = (
  userId: UserParamsDto["id"],
  productId: ProductParamsDto["id"]
) => {
  return prisma.productLike.create({
    data: { userId, productId },
  });
};

const deleteLike = (
  userId: UserParamsDto["id"],
  productId: ProductParamsDto["id"]
) => {
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
