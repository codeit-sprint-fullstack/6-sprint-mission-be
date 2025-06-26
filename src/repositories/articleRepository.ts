import { Article, User } from "@prisma/client";
import prisma from "../config/prisma";

// TODO: any 수정 필요
async function findAll(options: any) {
  const { where } = options;

  const [totalCount, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      ...options,
      omit: { writerId: true },
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

  return { totalCount, articles };
}

async function save(
  data: Pick<Article, "title" | "content">,
  writerId: Article["writerId"]
) {
  return await prisma.article.create({
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
    prisma.like.findUnique({
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
        likes: true,
      },
    }),
  ]);
}

async function update(
  articleId: Article["id"],
  data: Pick<Article, "title" | "content">
) {
  return await prisma.article.update({
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
  return await prisma.article.delete({
    where: { id: articleId },
  });
}

async function findLike(articleId: Article["id"], userId: User["id"]) {
  return await prisma.like.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
}

async function createLike(articleId: Article["id"], userId: User["id"]) {
  const [, article] = await prisma.$transaction([
    prisma.like.create({
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
    prisma.like.delete({
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
