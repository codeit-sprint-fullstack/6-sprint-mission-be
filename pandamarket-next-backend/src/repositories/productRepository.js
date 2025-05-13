import prisma from "../../prisma/client.js";

async function getByOptions(options) {
  return await prisma.item.findMany(options);
}

async function getById(id, userId) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      comments: true,
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

async function createFavorite(id, userId) {
  const isFavorite = await prisma.item.findFirst({
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
  return await prisma.item.update({
    where: { id },
    data: {
      favoriteUsers: { connect: { id: userId } },
      favoriteCount: {
        increment: 1,
      },
    },
  });
}

async function removeFavorite(id, userId) {
  const isFavorite = await prisma.item.findFirst({
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
  return await prisma.item.update({
    where: { id },
    data: {
      favoriteUsers: { disconnect: { id: userId } },
      favoriteCount: {
        decrement: 1,
      },
    },
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
