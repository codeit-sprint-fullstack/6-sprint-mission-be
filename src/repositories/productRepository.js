import prisma from "../../prisma/client.prisma.js";

const findAll = (query) => {
  const { offset, limit, orderBy, keyword } = query;
  const filter = {
    OR: [
      { name: { contains: keyword || "", mode: "insensitive" } },
      { description: { contains: keyword || "", mode: "insensitive" } },
    ],
  };
  const orderByCondition =
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

const findProductLikeCountById = (productId) => {
  return prisma.productLike.count({ where: { productId } });
};

const findByIdWithTx = (tx, userId, productId) => {
  return Promise.all([
    tx.product.findUnique({
      where: { id: productId },
      omit: { updatedAt: true, authorId: true },
      include: { author: { select: { id: true, nickname: true } } },
    }),
    tx.productImage.findMany({
      where: { productId },
    }),
    tx.productLike.count({
      where: { productId },
    }),
    tx.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    }),
  ]);
};

const findOnlyProductByIdWithTx = (tx, productId) => {
  return tx.product.findUnique({ where: { id: productId } });
};

const findProductTagByIdWithTx = (tx, productId) => {
  return tx.productTag.findMany({
    where: { productId },
    include: { tag: true },
  });
};

const createWithTx = (tx, userId, body) => {
  const { name, description, price } = body;

  return tx.product.create({
    data: { name, description, price: Number(price), authorId: userId },
  });
};

const createProductImageWithTx = (tx, imageUrl = "", userId, productId) => {
  return tx.productImage.create({
    data: { imageUrl, userId, productId },
  });
};

const deleteProductImageWithTx = (tx, productId) => {
  return tx.productImage.deleteMany({
    where: { productId },
  });
};

const findTagByNameWithTx = (tx, tagName) => {
  return tx.tag.findUnique({ where: { name: tagName } });
};

const createTagWithTx = (tx, tagName) => {
  return tx.tag.create({ data: { name: tagName } });
};

const createProductTagWithTx = (tx, productId, tagId) => {
  return tx.productTag.create({ data: { productId, tagId } });
};

const updateProductWithTx = (tx, productId, body) => {
  const { name, description, price } = body;

  return tx.product.update({
    where: { id: productId },
    data: { name, description, price: Number(price) },
  });
};

const deleteProductTagsWithTx = (tx, productId) => {
  return tx.productTag.deleteMany({ where: { productId } });
};

const deleteProductWithTx = (tx, productId) => {
  return tx.product.delete({ where: { id: productId } });
};

const addlikeProduct = (userId, productId) => {
  return prisma.productLike.create({ data: { userId, productId } });
};

const cancelLikeProduct = (userId, productId) => {
  return prisma.productLike.delete({
    where: { userId_productId: { userId, productId } },
  });
};

export default {
  findAll,
  findProductLikeCountById,
  findByIdWithTx,
  findOnlyProductByIdWithTx,
  findProductTagByIdWithTx,
  createWithTx,
  createProductImageWithTx,
  findTagByNameWithTx,
  createTagWithTx,
  createProductTagWithTx,
  updateProductWithTx,
  deleteProductImageWithTx,
  deleteProductTagsWithTx,
  deleteProductWithTx,
  addlikeProduct,
  cancelLikeProduct,
};
