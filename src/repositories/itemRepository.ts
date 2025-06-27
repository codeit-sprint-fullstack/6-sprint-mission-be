import prisma from "../config/client.prisma";
import { Item, User, Prisma } from "@prisma/client";

async function getByOptions(options: any) {
  return await prisma.item.findMany(options);
}

async function getById(id: Item["id"], userId: User["id"]) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  const isFavorite = await prisma.item.findFirst({
    where: {
      id,
      favoriteUsers: {
        some: { id: userId },
      },
    },
  });
  return { ...item, isFavorite };
}

async function save(
  item: Pick<
    Item,
    "name" | "description" | "price" | "tags" | "images" | "userId"
  >
) {
  return await prisma.item.create({
    data: {
      name: item.name,
      description: item.description,
      price: item.price,
      tags: item.tags,
      images: item.images,
      user: {
        connect: {
          id: item.userId,
        },
      },
    },
  });
}

async function edit(
  id: Item["id"],
  item: Partial<
    Pick<Item, "name" | "description" | "price" | "tags" | "images">
  >
) {
  return await prisma.item.update({
    where: { id },
    data: {
      name: item.name,
      description: item.description,
      price: item.price,
      tags: item.tags,
      images: item.images,
    },
  });
}

async function remove(id: Item["id"]) {
  return await prisma.item.delete({
    where: { id },
  });
}

async function createFavorite(id: Item["id"], userId: User["id"]) {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const isFavorite = await tx.item.findFirst({
      where: {
        id,
        favoriteUsers: {
          some: { id: userId },
        },
      },
    });

    if (isFavorite) {
      throw new Error("이미 즐겨찾기 목록에 추가된 아이템입니다.");
    }

    return await tx.item.update({
      where: { id },
      data: {
        favoriteUsers: { connect: { id: userId } },
        favoriteCount: {
          increment: 1,
        },
      },
    });
  });
}

async function removeFavorite(id: Item["id"], userId: User["id"]) {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const isFavorite = await tx.item.findFirst({
      where: {
        id,
        favoriteUsers: {
          some: { id: userId },
        },
      },
    });

    if (!isFavorite) {
      throw new Error("이 아이템을 즐겨찾기에서 삭제할 수 없습니다.");
    }

    return await tx.item.update({
      where: { id },
      data: {
        favoriteUsers: { disconnect: { id: userId } },
        favoriteCount: {
          decrement: 1,
        },
      },
    });
  });
}

export default {
  getByOptions,
  getById,
  save,
  edit,
  remove,
  createFavorite,
  removeFavorite,
};
