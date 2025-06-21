import prisma from "../../prisma/client";
import { Article, User } from "../generated/prisma";

async function getByOptions(options: any) {
  return await prisma.article.findMany(options);
}

async function getById(id: Article["id"], userId: User["id"]) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  const isFavorite = await prisma.article.findFirst({
    where: {
      id,
      favoriteUsers: {
        some: { id: userId },
      },
    },
  });
  return { ...article, isFavorite };
}

async function save(
  article: Pick<Article, "title" | "content" | "images" | "userId">
) {
  return await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      images: article.images,
      user: {
        connect: {
          id: article.userId,
        },
      },
    },
  });
}

async function edit(
  id: Article["id"],
  article: Partial<Pick<Article, "title" | "content" | "images" | "userId">>
) {
  return await prisma.article.update({
    where: { id },
    data: {
      title: article.title,
      content: article.content,
      images: article.images,
    },
  });
}

async function remove(id: Article["id"]) {
  return await prisma.article.delete({
    where: { id },
  });
}

async function createFavorite(id: Article["id"], userId: User["id"]) {
  return await prisma.$transaction(async (tx) => {
    const isFavorite = await tx.article.findFirst({
      where: {
        id,
        favoriteUsers: {
          some: { id: userId },
        },
      },
    });

    if (isFavorite) {
      throw new Error("이미 즐겨찾기 목록에 추가된 게시글입니다.");
    }

    return await tx.article.update({
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

async function removeFavorite(id: Article["id"], userId: User["id"]) {
  return await prisma.$transaction(async (tx) => {
    const isFavorite = await tx.article.findFirst({
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

    return await tx.article.update({
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
