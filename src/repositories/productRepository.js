import prisma from "../config/prisma.js";

async function getProduct(id) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}

async function getProducts(options) {
  return await prisma.product.findMany(options);
}

async function save(data) {
  return prisma.product.create({
    data: data,
  });
}

async function update(productId, data) {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: data,
  });
}

export default {
  getProduct,
  getProducts,
  save,
  update,
};
