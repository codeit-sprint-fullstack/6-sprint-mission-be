import commentRepository from "../repositories/commentRepository";
import { CommentService, CreateCommentInput } from "../types/index";
import { Comment } from "@prisma/client";

async function create(commentData: CreateCommentInput): Promise<any> {
  return await commentRepository.createComment(commentData);
}

async function getByArticleId(articleId: number): Promise<any[]> {
  return await commentRepository.getCommentsByArticleId(articleId);
}

async function getByProductId(productId: number): Promise<any[]> {
  return await commentRepository.getCommentsByProductId(productId);
}

async function update(commentId: number, newContent: string): Promise<Comment> {
  return await commentRepository.updateComment(commentId, newContent);
}

async function deleteById(commentId: number): Promise<Comment> {
  return await commentRepository.deleteComment(commentId);
}

const commentService: CommentService = {
  create,
  getByArticleId,
  getByProductId,
  update,
  deleteById,
};

export default commentService;
