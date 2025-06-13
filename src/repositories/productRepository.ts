import { Product, User, Comment, Prisma } from "@prisma/client";
import prisma from "../config/client.prisma.js";
import { NotFoundError } from "../types/errors.js";

async function save(product: Product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imageUrl: product.imageUrl,
      authorId: product.authorId,
    },
  });
}

async function getById(productId: Product["id"], userId: User["id"]) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      favorites: {
        select: { id: true, userId: true },
      },
    },
  });

  if (!product) throw new NotFoundError("해당 제품이 없습니다");

  const favoriteCounts = product.favorites.length;
  const isLiked = product.favorites.some((fav) => fav.userId === userId);

  return {
    ...product,
    favoriteCounts,
    isLiked,
  };
}

async function getAll(options: {
  order: "createdAt" | "favorite";
  skip: number;
  take: number;
  keyword: string;
}) {
  const { order = "createdAt", skip = 0, take = 4, keyword = "" } = options;

  let orderByOption;

  if (order === "favorite") {
    orderByOption = {
      favorites: {
        _count: Prisma.SortOrder.desc,
      },
    };
  } else {
    orderByOption = {
      createdAt: Prisma.SortOrder.desc,
    };
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    orderBy: orderByOption,
    skip,
    take,
    include: {
      _count: {
        select: { favorites: true },
      },
    },
  });
  return products;
}

async function update(
  productId: Product["id"],
  data: Pick<Product, "name" | "description" | "price" | "tags" | "imageUrl">
) {
  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      imageUrl: data.imageUrl,
      tags: data.tags,
      price: data.price,
      description: data.description,
      name: data.name,
    },
  });
  return updatedProduct;
}

async function deleteById(id: Product["id"]) {
  return await prisma.product.delete({
    where: { id },
  });
}

async function saveProductComment(comment: Comment) {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      productId: comment.productId,
      authorId: comment.authorId,
    },
  });
  return createdComment;
}

async function getAllProductComment(id: Product["id"]) {
  const productComments = await prisma.comment.findMany({
    where: {
      productId: id,
    },
  });
  return productComments;
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
  saveProductComment,
  getAllProductComment,
};
