import {
  Article,
  ArticleComment,
  Prisma,
  PrismaClient,
  User,
} from "@prisma/client";
import prisma from "../config/client.prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

type TQuery = {
  limit: string;
  cursor: string;
};

type TOptions = {
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
};

type Tcomment = {
  id: number;
  content: string;
  createdAt: Date;
  authorId: string;
  articleId: number;
} | null;

const findAll = async (
  query: TQuery,
  articleId: Article["id"],
  comment: Tcomment
) => {
  const { limit, cursor } = query;

  return await prisma.articleComment.findMany({
    where: { articleId },
    skip: comment ? 1 : undefined,
    take: Number(limit) || 10,
    cursor: comment ? { id: Number(cursor) } : undefined,
    omit: { articleId: true, authorId: true },
    include: { author: { select: { id: true, nickname: true } } },
  });
};

const findByCursor = async (articleId: Article["id"], cursor: string) => {
  return await prisma.articleComment.findFirst({
    where: { articleId, id: Number(cursor) || 0 },
  });
};

const findById = async (
  articleId: Article["id"],
  commentId: ArticleComment["id"]
) => {
  return await prisma.articleComment.findUnique({
    where: { articleId, id: commentId },
  });
};

const createComment = async (
  authorId: User["id"],
  articleId: Article["id"],
  content: ArticleComment["content"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.articleComment.create({
    data: { authorId, articleId, content },
  });
};

const updateComment = async (
  articleId: Article["id"],
  commentId: ArticleComment["id"],
  content: ArticleComment["content"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.articleComment.update({
    where: { articleId, id: commentId },
    data: { content },
  });
};

const deleteComment = async (
  articleId: Article["id"],
  commentId: ArticleComment["id"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.articleComment.delete({
    where: { articleId, id: commentId },
  });
};

export default {
  findAll,
  findByCursor,
  findById,
  createComment,
  updateComment,
  deleteComment,
};
