import prisma from "../db/prisma/client.prisma.js";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto.js";

export const createProductRepo = async (dto: CreateProductDTO) => {
  return await prisma.product.create({
    data: {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      tags: dto.tags || [],
      image: dto.image || null,
      user: {
        connect: { id: dto.userId },
      },
    },
    include: {
      user: true, 
    },
  });
};


export const getAllProductsRepo = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true, 
    },
  });
};

export const getProductByIdRepo = async (productId: number) => {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      user: {
        select: { nickname: true },
      },
      favorites: {
        select: { userId: true },
      },
    },
  });
};

export const updateProductRepo = async (
  productId: number,
  data: UpdateProductDTO
) => {
  return await prisma.product.update({
    where: { id: productId },
    data,
  });
};

export const getUserNicknameByIdRepo = async (userId?: number) => {
  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { id: userId },
    select: { nickname: true },
  });
};

export const deleteProductRepo = async (productId: number) => {
  return await prisma.product.delete({
    where: { id: productId },
  });
};