import prisma from "../../prisma/client.prisma.js";

const findAll = (query) => {
  const { offset, limit, orderBy, keyword } = query;
  const filter = {
    OR: [
      { name: { contains: keyword || "", mode: "insensitive" } },
      { description: { contains: keyword || "", mode: "insensitive" } },
    ],
  };

  return Promise.all([
    prisma.product.findMany({
      where: filter,
      skip: (Number(offset) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      orderBy: { createdAt: orderBy === "recent" ? "desc" : "asc" },
      omit: { description: true, updatedAt: true },
      include: { productImages: { select: { imageUrl: true } } },
    }),
    prisma.product.count({ where: filter }),
  ]);
};

const findByIdWithTx = (tx, userId, productId) => {
  return Promise.all([
    tx.product.findUnique({
      where: { id: productId },
      omit: { updatedAt: true },
    }),
    tx.productImage.findMany({
      where: { productId },
    }),
    tx.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    }),
  ]);
};

const findProductTagByIdWithTx = (tx, productId) => {
  return tx.productTag.findMany({
    where: { productId },
    include: { tag: true },
  });
};

const createWithTx = (tx, body) => {
  const { name, description, price } = body;

  return tx.product.create({
    data: { name, description, price: Number(price) },
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
  findByIdWithTx,
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
