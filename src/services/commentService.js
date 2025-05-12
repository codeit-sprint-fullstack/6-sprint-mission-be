import prisma from "../config/prisma.js";

async function findComments({ articleId, productId, cursor, take }) {
  const where = articleId ? { articleId } : productId ? { productId } : {};

  const comments = await prisma.comment.findMany({
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
  const hasNextPage = comments.length > take;
  const list = hasNextPage ? comments.slice(0, -1) : comments; // 다음 페이지 있으면 마지막 요소 제외

  const nextCursor = hasNextPage ? list[list.length - 1].id : null; // list 마지막 항목 id를 nextCursor로 설정

  return { list, nextCursor };
}

async function createComment({ articleId, productId, content, userId }) {
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

async function updateCommentById(commentId, data) {
  return prisma.comment.update({
    where: { id: commentId },
    data,
    include: { writer: { select: { id: true, nickname: true, image: true } } },
  });
}

async function deleteCommentById(commentId) {
  return prisma.comment.delete({ where: { id: commentId } });
}

export default {
  findComments,
  createComment,
  updateCommentById,
  deleteCommentById,
};
