import prisma from "../config/prisma.js";

export async function create(data) {
  return prisma.product.create({ data });
}

export async function findAllWithLikes(userId) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      likes: {
        select: { userId: true },
      },
    },
  });

  return products.map((product) => ({
    ...product,
    isLiked: userId
      ? product.likes.some((like) => like.userId === userId)
      : false,
    likeCount: product.likes.length,
  }));
}

export async function findById(id) {
  return prisma.product.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function remove(id) {
  return prisma.product.delete({ where: { id } });
}

export default {
  create,
  findAllWithLikes,
  findById,
  update,
  remove,
};
