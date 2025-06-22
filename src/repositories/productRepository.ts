import { Prisma, Product } from "@prisma/client";
import prisma from "../config/prisma";

//상품생성
export async function create(
  data: Prisma.ProductCreateInput
): Promise<Product> {
  return prisma.product.create({ data });
}

export async function findAllWithLikes(userId: number) {
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

export async function findById(id: number): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function update(
  id: number,
  data: Prisma.ProductUpdateInput
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function remove(id: number): Promise<Product> {
  return prisma.product.delete({ where: { id } });
}

export default {
  create,
  findAllWithLikes,
  findById,
  update,
  remove,
};
