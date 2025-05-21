import prisma from "../config/prisma.js";

async function findAll(where, take, cursor) {
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

async function findById(id) {
  return prisma.comment.findUnique({
    where: {
      id,
    },
  });
}

async function save(articleId, productId, content, userId) {
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

async function update(commentId, data) {
  return prisma.comment.update({
    where: { id: commentId },
    data,
    include: { writer: { select: { id: true, nickname: true, image: true } } },
  });
}

async function remove(commentId) {
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
