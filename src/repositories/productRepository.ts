import { Prisma, Product, User } from "@prisma/client";
import { prisma } from "../db/prisma/client.prisma";

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

async function findById(id: Product["id"], userId?: User["id"]) {
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
        ProductLike: {
          where: { userId }, // 로그인한 사용자 기준 필터
          select: { id: true }, // 존재 여부만 확인하면 되므로 id만
        },
      }),
    },
  });
}

async function findLikedProductIdsByUser(
  userId: User["id"],
  productIds: Product["id"][]
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

async function create(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  return prisma.product.create({
    data: productData,
  });
}

async function update(id: Product["id"], data: Partial<Product>) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

async function remove(id: Product["id"]) {
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
