import prisma from "../config/prisma.js";

async function getById(id) {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}
async function getAll() {
  return await prisma.product.findMany({
    orderBy: {
      price: "asc",
    },
  });
}
async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
      ownerId: product.ownerId,
    },
  });
}

export default {
  getById,
  save,
  getAll,
};
