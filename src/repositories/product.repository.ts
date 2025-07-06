import { Product, User } from "@prisma/client";
import prisma from "../configs/prisma.config";

interface ProductDataType {
  name: Product["name"];
  description: Product["description"];
  price: Product["price"];
  tags: string[];
  images: string[];
}

async function findAll(options: any) {
  const { where } = options;

  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany(options),
  ]);
  return { totalCount, products };
}

async function save(data: ProductDataType, ownerId: Product["ownerId"]) {
  return await prisma.product.create({
    data: { ...data, owner: { connect: { id: ownerId } } },
  });
}

async function findById(productId: Product["id"], userId: User["id"]) {
  return await prisma.$transaction([
    prisma.like.findUnique({
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

async function update(productId: Product["id"], data: ProductDataType) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data,
  });
}

async function remove(productId: Product["id"]) {
  return await prisma.product.delete({
    where: { id: productId },
  });
}

async function findLike(productId: Product["id"], userId: User["id"]) {
  return await prisma.like.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

async function createLike(productId: Product["id"], userId: User["id"]) {
  const [, product] = await prisma.$transaction([
    prisma.like.create({
      data: { userId, productId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);
  return product;
}

async function deleteLike(productId: Product["id"], userId: User["id"]) {
  const [, product] = await prisma.$transaction([
    prisma.like.delete({
      where: { userId_productId: { userId, productId } },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { likeCount: { decrement: 1 } },
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
