import prisma from "../db/prisma/client.js";

/**
 * 댓글 생성 (게시글 또는 상품에 대해)
 */
async function createComment({
  content,
  authorId,
  articleId = null,
  productId = null,
}) {
  const newComment = await prisma.comment.create({
    data: {
      content,
      author: {
        connect: { id: authorId },
      },
      article: articleId ? { connect: { id: articleId } } : undefined,
      product: productId ? { connect: { id: productId } } : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });
  return newComment;
}

/**
 * 특정 게시글의 댓글 목록 조회
 */
async function getCommentsByArticleId(articleId) {
  const comments = await prisma.comment.findMany({
    where: {
      articleId: parseInt(articleId, 10),
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });
  return comments;
}

/**
 * 특정 상품의 댓글 목록 조회
 */
async function getCommentsByProductId(productId) {
  const comments = await prisma.comment.findMany({
    where: {
      productId: parseInt(productId, 10),
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });
  return comments;
}

/**
 * 댓글 수정
 */
async function updateComment(commentId, newContent) {
  const updated = await prisma.comment.update({
    where: { id: parseInt(commentId, 10) },
    data: { content: newContent },
  });
  return updated;
}

/**
 * 댓글 삭제
 */
async function deleteComment(commentId) {
  const deleted = await prisma.comment.delete({
    where: { id: parseInt(commentId, 10) },
  });
  return deleted;
}

export default {
  createComment,
  getCommentsByArticleId,
  getCommentsByProductId,
  updateComment,
  deleteComment,
};
