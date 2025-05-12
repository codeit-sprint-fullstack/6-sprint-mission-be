import prisma from "../../prisma/client.js";

async function getByOptions(options) {
  return await prisma.item.findMany(options);
}

async function getById(id) {
  return await prisma.item.findUnique({
    where: { id },
    include: {
      comments: true,
    },
  });
}

async function save(product) {
  return await prisma.item.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      image: product.image,
      user: {
        connect: {
          id: product.userId,
        },
      },
    },
  });
}

async function edit(id, product) {
  return await prisma.item.update({
    where: { id },
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      image: product.image,
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
