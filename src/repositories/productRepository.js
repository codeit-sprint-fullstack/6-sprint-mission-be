import prisma from "../config/prisma.js";

async function findAll(options) {
  return await prisma.product.findMany(options);
}

async function save(data, ownerId) {
  return prisma.product.create({
    data: { ...data, owner: { connect: { id: ownerId } } },
  });
}

async function findById(productId, userId) {
  return await prisma.$transaction([
    prisma.productFavorite.findUnique({
      where: { userId_productId: { userId, productId } },
    }),
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: { nickname: true },
        },
      },
    }),
  ]);
}

async function update(productId, data) {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: data,
  });
}

async function remove(productId) {
  return prisma.product.delete({
    where: { id: productId },
  });
}

async function findLike(productId, userId) {
  return prisma.productFavorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

async function createLike(productId, userId) {
  const [, product] = await prisma.$transaction([
    prisma.productFavorite.create({
      data: { userId, productId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);
  return product;
}

async function deleteLike(productId, userId) {
  const [, product] = await prisma.$transaction([
    prisma.productFavorite.delete({
      where: { userId_productId: { userId, productId } },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);
  return product;
}

export default {
  save,
  findAll,
  findById,
  update,
  remove,
  findLike,
  createLike,
  deleteLike,
};
