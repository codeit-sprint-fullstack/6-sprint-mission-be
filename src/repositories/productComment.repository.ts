import {
  Prisma,
  PrismaClient,
  Product,
  ProductComment,
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
  productId: number;
  createdAt: Date;
  authorId: string;
} | null;

const findAll = async (
  query: TQuery,
  productId: Product["id"],
  comment: Tcomment
) => {
  const { limit, cursor } = query;

  return await prisma.productComment.findMany({
    where: { productId },
    skip: comment ? 1 : undefined,
    take: Number(limit) || 10,
    cursor: comment ? { id: Number(cursor) } : undefined,
    omit: { productId: true, authorId: true },
    include: { author: { select: { id: true, nickname: true } } },
  });
};

const findByCursor = async (productId: Product["id"], cursor: string) => {
  return await prisma.productComment.findFirst({
    where: { productId, id: Number(cursor) || 0 },
  });
};

const findById = async (
  productId: Product["id"],
  commentId: ProductComment["id"]
) => {
  return await prisma.productComment.findUnique({
    where: { productId, id: commentId },
  });
};

const createComment = async (
  authorId: User["id"],
  productId: Product["id"],
  content: ProductComment["content"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.productComment.create({
    data: { authorId, productId, content },
  });
};

const updateComment = async (
  productId: Product["id"],
  commentId: ProductComment["id"],
  content: ProductComment["content"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.productComment.update({
    where: { productId, id: commentId },
    data: { content },
  });
};

const deleteComment = async (
  productId: Product["id"],
  commentId: ProductComment["id"],
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.productComment.delete({
    where: { productId, id: commentId },
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
