import { prisma } from "../db/prisma/client.prisma.js";

async function findAll({ skip, take, where, orderBy }) {
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

async function countAll(where) {
  return prisma.product.count({ where });
}

async function findById(id, userId) {
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

async function findLikedProductIdsByUser(userId, productIds) {
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

async function create(productData) {
  return prisma.product.create({
    data: productData,
  });
}

async function update(id, data) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

async function remove(id) {
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
