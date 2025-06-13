import { Article, Prisma, PrismaClient, User } from "@prisma/client";
import prisma from "../config/client.prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

type TGetArticlesQuery = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};

type TOptions = {
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
};

const findAll = (query: TGetArticlesQuery) => {
  const { offset, limit, orderBy, keyword } = query;
  const filter: Prisma.ArticleWhereInput = {
    OR: [
      { title: { contains: keyword || "", mode: "insensitive" } },
      { content: { contains: keyword || "", mode: "insensitive" } },
    ],
  };
  const orderByCondition: Prisma.ArticleOrderByWithRelationInput =
    orderBy === "recent"
      ? { createdAt: "desc" }
      : { articleLikes: { _count: "desc" } };

  return Promise.all([
    prisma.article.findMany({
      where: filter,
      skip: (Number(offset) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      orderBy: orderByCondition,
      omit: { updatedAt: true, authorId: true },
      include: { author: { select: { nickname: true } } },
    }),
    prisma.article.count({ where: filter }),
  ]);
};

const findArticleLikeCountById = (articleId: Article["id"]) => {
  return prisma.articleLike.count({ where: { articleId } });
};

const findById = (userId: User["id"], articleId: Article["id"]) => {
  return Promise.all([
    prisma.article.findUnique({
      where: { id: articleId },
      omit: { updatedAt: true, authorId: true },
      include: { author: { select: { id: true, nickname: true } } },
    }),
    prisma.articleLike.count({
      where: { articleId },
    }),
    prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    }),
  ]);
};

const createArticle = (
  userId: User["id"],
  body: Pick<Article, "title" | "content">,
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  const { title, content } = body;

  return client.article.create({
    data: { title, content, authorId: userId },
  });
};

const updateArticle = (
  articleId: Article["id"],
  body: Partial<Pick<Article, "title" | "content">>,
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  const { title, content } = body;

  return client.article.update({
    where: { id: articleId },
    data: { title, content },
  });
};

const deleteArticle = (articleId: Article["id"], options: TOptions = {}) => {
  const { tx } = options;
  const client = tx || prisma;

  return client.article.delete({
    where: { id: articleId },
  });
};

const addlikeArticle = (userId: User["id"], articleId: Article["id"]) => {
  return prisma.articleLike.create({ data: { userId, articleId } });
};

const cancelLikeArticle = (userId: User["id"], articleId: Article["id"]) => {
  return prisma.articleLike.delete({
    where: { userId_articleId: { userId, articleId } },
  });
};

export default {
  findAll,
  findArticleLikeCountById,
  findById,
  createArticle,
  updateArticle,
  deleteArticle,
  addlikeArticle,
  cancelLikeArticle,
};
