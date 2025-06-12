import { Product, User } from "@prisma/client";
import prisma from "../config/prisma";

// TODO: any 수정 필요
async function findAll(options: any) {
  return await prisma.product.findMany(options);
}

async function save(
  data: Pick<Product, "images" | "tags" | "price" | "description" | "name">,
  ownerId: Product["ownerId"]
) {
  return prisma.product.create({
    data: { ...data, owner: { connect: { id: ownerId } } },
  });
}

async function findById(productId: Product["id"], userId: User["id"]) {
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

async function update(
  productId: Product["id"],
  data: Pick<Product, "images" | "tags" | "price" | "description" | "name">
) {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data,
  });
}

async function remove(productId: Product["id"]) {
  return prisma.product.delete({
    where: { id: productId },
  });
}

async function findLike(productId: Product["id"], userId: User["id"]) {
  return prisma.productFavorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

async function createLike(productId: Product["id"], userId: User["id"]) {
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

async function deleteLike(productId: Product["id"], userId: User["id"]) {
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
