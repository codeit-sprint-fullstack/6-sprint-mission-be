import prismaClient from '../models/prisma/prismaClient';

export async function create(productData: any, userId: number) {
  const newProduct = await prismaClient.product.create({
    data: { ...productData, userId },
  });
  return newProduct;
}

export async function getAll() {
  const products = await prismaClient.product.findMany();
  return products;
}

export async function getById(productId: number) {
  const product = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  return product;
}

export async function update(productId: number, updateData: any) {
  const updatedProduct = await prismaClient.product.update({
    where: { id: productId },
    data: updateData,
  });
  return updatedProduct;
}

export async function deleteById(productId: number) {
  const deletedProduct = await prismaClient.product.delete({
    where: { id: productId },
  });
  return deletedProduct;
}