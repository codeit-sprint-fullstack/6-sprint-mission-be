import prisma from "../config/prisma.js";

async function findProducts({ offset, search }) {
  const options = { orderBy: { createdAt: "desc" } };
  if (offset) options.skip = offset;
  if (search) {
    options.where = {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    };
  }
  return prisma.product.findMany(options);
}

async function createProduct(data, ownerId) {
  return prisma.product.create({
    data: { ...data, owner: { connect: { id: ownerId } } },
  });
}

async function findProductById(productId, userId) {
  return await prisma.$transaction([
    prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    }),
    prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        favoriteCount: true,
        ownerId: true,
        owner: {
          select: { nickname: true },
        },
      },
    }),
  ]);
}

async function updateProductById(productId, data) {
  return prisma.product.update({ where: { id: productId }, data });
}

async function deleteProductById(productId) {
  return prisma.product.delete({
    where: { id: productId },
  });
}

async function likeProductById(productId, userId) {
  const alreadyLike = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (alreadyLike) {
    throw new Error("이미 찜한 상품입니다.");
  }
  return await prisma.$transaction([
    prisma.favorite.create({
      data: { userId, productId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);
}

async function unlikeProductById(productId, userId) {
  const alreadyLike = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (!alreadyLike) {
    throw new Error("찜하지 않은 상품입니다.");
  }
  return await prisma.$transaction([
    prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);
}

export default {
  findProducts,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
  likeProductById,
  unlikeProductById,
};
