import prisma from "../../prisma/client.js";

async function getByOptions(options) {
  return await prisma.item.findMany(options);
}

async function getById(id) {
  return await prisma.item.findUnique({
    where: {
      id,
    },
  });
}

async function save(product) {
  return await prisma.item.create({
    data: {
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
      tags: product.tags,
    },
  });
}

async function edit(id, product) {
  return await prisma.item.update({
    where: { id },
    data: {
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
      tags: product.tags,
    },
  });
}

async function remove(id) {
  return await prisma.item.delete({
    where: { id },
  });
}

export default {
  getByOptions,
  getById,
  save,
  edit,
  remove,
};
