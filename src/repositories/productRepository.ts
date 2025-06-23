import { Product } from "@prisma/client";
import prisma from "../config/prisma";

async function getById(id: Product["id"]) {
  return await prisma.product.findUnique({
    where: {
      id: id,
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
async function save(product: Product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      ownerId: product.ownerId,
    },
  });
}

export default {
  getById,
  save,
  getAll,
};
