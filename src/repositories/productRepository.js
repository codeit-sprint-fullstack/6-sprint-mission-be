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
    }),
    prisma.product.count({ where: filter }),
  ]);
};

const findByIdWithTx = (tx, productId) => {
  return tx.product.findUnique({
    where: { id: productId },
    omit: { updatedAt: true },
  });
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
    data: { name, description, price },
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
    data: { name, description, price },
  });
};

const deleteProductTagsWithTx = (tx, productId) => {
  return tx.productTag.deleteMany({ where: { productId } });
};

const deleteProductWithTx = (tx, productId) => {
  return tx.product.delete({ where: { id: productId } });
};

export default {
  findAll,
  findByIdWithTx,
  findProductTagByIdWithTx,
  createWithTx,
  findTagByNameWithTx,
  createTagWithTx,
  createProductTagWithTx,
  updateProductWithTx,
  deleteProductTagsWithTx,
  deleteProductWithTx,
};
