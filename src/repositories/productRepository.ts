import {
  Prisma,
  PrismaClient,
  Product,
  ProductTag,
  Tag,
  User,
} from "@prisma/client";
import prisma from "../config/client.prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

type TGetProductsQuery = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};

type TOptions = {
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
};

const findAll = (query: TGetProductsQuery) => {
  const { offset, limit, orderBy, keyword } = query;
  const filter: Prisma.ProductWhereInput = {
    OR: [
      { name: { contains: keyword || "", mode: "insensitive" } },
      { description: { contains: keyword || "", mode: "insensitive" } },
    ],
  };
  const orderByCondition: Prisma.ProductOrderByWithRelationInput =
    orderBy === "recent"
      ? { createdAt: "desc" }
      : { productLikes: { _count: "desc" } };

  return Promise.all([
    prisma.product.findMany({
      where: filter,
      skip: (Number(offset) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      orderBy: orderByCondition,
      omit: { description: true, authorId: true, updatedAt: true },
      include: { productImages: { select: { imageUrl: true } } },
    }),
    prisma.product.count({ where: filter }),
  ]);
};

const findProductLikeCountById = (productId: Product["id"]) => {
  return prisma.productLike.count({ where: { productId } });
};

const findById = (userId: User["id"], productId: Product["id"]) => {
  return Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      omit: { updatedAt: true, authorId: true },
      include: { author: { select: { id: true, nickname: true } } },
    }),
    prisma.productImage.findMany({
      where: { productId },
    }),
    prisma.productLike.count({
      where: { productId },
    }),
    prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    }),
  ]);
};

const findProductTagById = (productId: Product["id"]) => {
  return prisma.productTag.findMany({
    where: { productId },
    include: { tag: true },
  });
};

const createProduct = (
  userId: User["id"],
  body: Pick<Product, "name" | "description" | "price">,
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  const { name, description, price } = body;

  return client.product.create({
    data: { name, description, price: Number(price), authorId: userId },
  });
};

const createProductImage = (
  userId: User["id"],
  productId: Product["id"],
  imageUrl: string = "",
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.productImage.create({
    data: { imageUrl, userId, productId },
  });
};

const deleteProductImage = (
  productId: Product["id"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.productImage.deleteMany({
    where: { productId },
  });
};

const findTagByName = (tagName: Tag["name"]) => {
  return prisma.tag.findUnique({ where: { name: tagName } });
};

const createTag = (tagName: Tag["name"], options: TOptions = {}) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.tag.create({ data: { name: tagName } });
};

const createProductTag = (
  productId: Product["id"],
  tagId: ProductTag["tagId"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.productTag.create({ data: { productId, tagId } });
};

const updateProduct = (
  productId: Product["id"],
  body: Pick<Product, "name" | "description" | "price">,
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  const { name, description, price } = body;

  return client.product.update({
    where: { id: productId },
    data: { name, description, price: Number(price) },
  });
};

const deleteProductTags = (
  productId: Product["id"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.productTag.deleteMany({ where: { productId } });
};

const deleteProduct = (productId: Product["id"], options: TOptions = {}) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.product.delete({ where: { id: productId } });
};

const addlikeProduct = (userId: User["id"], productId: Product["id"]) => {
  return prisma.productLike.create({ data: { userId, productId } });
};

const cancelLikeProduct = (userId: User["id"], productId: Product["id"]) => {
  return prisma.productLike.delete({
    where: { userId_productId: { userId, productId } },
  });
};

export default {
  findAll,
  findProductLikeCountById,
  findById,
  findProductTagById,
  createProduct,
  createProductImage,
  findTagByName,
  createTag,
  createProductTag,
  updateProduct,
  deleteProductImage,
  deleteProductTags,
  deleteProduct,
  addlikeProduct,
  cancelLikeProduct,
};
