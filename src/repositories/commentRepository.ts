import prisma from "../db/prisma/client";
import { CommentRepository, CreateCommentInput } from "../types/index";
import { Comment } from "@prisma/client";

/**
 * 댓글 생성 (게시글 또는 상품에 대해)
 */
async function createComment({
  content,
  authorId,
  articleId = null,
  productId = null,
}: CreateCommentInput): Promise<any> {
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
async function getCommentsByArticleId(articleId: number): Promise<any[]> {
  const comments = await prisma.comment.findMany({
    where: {
      articleId: parseInt(articleId.toString(), 10),
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
async function getCommentsByProductId(productId: number): Promise<any[]> {
  const comments = await prisma.comment.findMany({
    where: {
      productId: parseInt(productId.toString(), 10),
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
 * 댓글 ID로 조회
 */
async function getById(commentId: number): Promise<any> {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId.toString(), 10) },
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
  return comment;
}

/**
 * 댓글 수정
 */
async function updateComment(
  commentId: number,
  newContent: string
): Promise<Comment> {
  const updated = await prisma.comment.update({
    where: { id: parseInt(commentId.toString(), 10) },
    data: { content: newContent },
  });
  return updated;
}

/**
 * 댓글 삭제
 */
async function deleteComment(commentId: number): Promise<Comment> {
  const deleted = await prisma.comment.delete({
    where: { id: parseInt(commentId.toString(), 10) },
  });
  return deleted;
}

const commentRepository: CommentRepository = {
  createComment,
  getCommentsByArticleId,
  getCommentsByProductId,
  getById,
  updateComment,
  deleteComment,
};

export default commentRepository;
