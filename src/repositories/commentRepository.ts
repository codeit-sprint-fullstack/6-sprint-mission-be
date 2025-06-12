import { Comment, User } from "@prisma/client";
import prisma from "../config/prisma";

async function findAll(where: any, take: number, cursor?: number) {
  return prisma.comment.findMany({
    where,
    take: take + 1, // 다음 페이지 있는지 확인
    ...(cursor && {
      skip: 1,
      cursor: {
        id: Number(cursor),
      },
    }),
    orderBy: { createdAt: "desc" },
    include: { writer: { select: { id: true, nickname: true, image: true } } },
  });
}

async function findById(id: Comment["id"]) {
  return prisma.comment.findUnique({
    where: {
      id,
    },
  });
}

async function save(
  articleId: Comment["articleId"],
  productId: Comment["productId"],
  content: Comment["content"],
  userId: User["id"]
) {
  return prisma.comment.create({
    data: {
      ...(articleId && { article: { connect: { id: articleId } } }),
      ...(productId && { product: { connect: { id: productId } } }),
      content,
      writer: {
        connect: { id: userId },
      },
    },
    include: {
      writer: { select: { id: true, nickname: true, image: true } },
    },
  });
}

async function update(
  commentId: Comment["id"],
  data: Pick<Comment, "content">
) {
  return prisma.comment.update({
    where: { id: commentId },
    data,
    include: { writer: { select: { id: true, nickname: true, image: true } } },
  });
}

async function remove(commentId: Comment["id"]) {
  return prisma.comment.delete({
    where: { id: commentId },
  });
}

export default {
  findAll,
  findById,
  save,
  update,
  remove,
};
