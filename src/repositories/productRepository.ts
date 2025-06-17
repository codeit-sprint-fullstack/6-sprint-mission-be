import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma/client.prisma";
import { ProductCreateDto, ProductParamsDto } from "../dtos/product.dto";
import { UserParamsDto } from "../dtos/user.dto";

async function findAll({
  skip,
  take,
  where,
  orderBy,
}: {
  skip: number;
  take: number;
  where: Prisma.ProductWhereInput;
  orderBy: Prisma.ProductOrderByWithRelationInput;
}) {
  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy,
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  });
}

async function countAll(where: Prisma.ProductWhereInput) {
  return prisma.product.count({ where });
}

async function findById(
  id: ProductParamsDto["id"],
  userId?: UserParamsDto["id"]
) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
      ...(userId && {
        productLikes: {
          where: { userId }, // 로그인한 사용자 기준 필터
          select: { id: true }, // 존재 여부만 확인하면 되므로 id만
        },
      }),
    },
  });
}

async function findLikedProductIdsByUser(
  userId: UserParamsDto["id"],
  productIds: ProductParamsDto["id"][]
) {
  return prisma.productLike.findMany({
    where: {
      userId,
      productId: {
        in: productIds,
      },
    },
    select: {
      productId: true,
    },
  });
}

async function create(productData: ProductCreateDto) {
  return prisma.product.create({
    data: {
      ...productData,
      likes: productData.likes || 0,
    },
  });
}

async function update(
  id: ProductParamsDto["id"],
  data: Partial<ProductCreateDto>
) {
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      likes: data.likes || 0,
    },
  });
}

async function remove(id: ProductParamsDto["id"]) {
  return prisma.product.delete({
    where: { id },
  });
}

export default {
  findAll,
  countAll,
  findById,
  create,
  update,
  remove,
  findLikedProductIdsByUser,
};
