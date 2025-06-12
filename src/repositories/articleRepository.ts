import { Article, User } from "@prisma/client";
import prisma from "../config/prisma";

// TODO: any 수정 필요
async function findAll(options: any) {
  return await prisma.article.findMany({
    ...options,
    select: {
      id: true,
      title: true,
      content: true,
      images: true,
      likeCount: true,
      createdAt: true,
      updatedAt: true,
      writer: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
}

async function save(
  data: Pick<Article, "title" | "content">,
  writerId: Article["writerId"]
) {
  return prisma.article.create({
    data: { ...data, writer: { connect: { id: writerId } } },
    include: {
      writer: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
}

async function findById(articleId: Article["id"], userId: User["id"]) {
  return await prisma.$transaction([
    prisma.articleFavorite.findUnique({
      where: { userId_articleId: { userId, articleId } },
    }),
    prisma.article.findUnique({
      where: { id: articleId },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
  ]);
}

async function update(
  articleId: Article["id"],
  data: Pick<Article, "title" | "content">
) {
  return prisma.article.update({
    where: {
      id: articleId,
    },
    data: data,
    include: {
      writer: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
}

async function remove(articleId: Article["id"]) {
  return prisma.article.delete({
    where: { id: articleId },
  });
}

async function findLike(articleId: Article["id"], userId: User["id"]) {
  return prisma.articleFavorite.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
}

async function createLike(articleId: Article["id"], userId: User["id"]) {
  const [, article] = await prisma.$transaction([
    prisma.articleFavorite.create({
      data: { userId, articleId },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { increment: 1 } },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
  ]);
  return article;
}

async function deleteLike(articleId: Article["id"], userId: User["id"]) {
  const [, article] = await prisma.$transaction([
    prisma.articleFavorite.delete({
      where: { userId_articleId: { userId, articleId } },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { decrement: 1 } },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
  ]);
  return article;
}

export default {
  save,
  findAll,
  findById,
  update,
  remove,
  findLike,
  createLike,
  deleteLike,
};
