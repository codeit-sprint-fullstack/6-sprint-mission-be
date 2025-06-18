import commentRepository from "../repositories/commentRepository";
import { Comment, User } from "@prisma/client";

interface GetCommentsInput {
  articleId: number | null;
  productId: number | null;
  take: number;
  cursor?: number;
}

async function getComments({
  articleId,
  productId,
  cursor,
  take,
}: GetCommentsInput) {
  const where = articleId ? { articleId } : productId ? { productId } : {};
  const comments = await commentRepository.findAll(where, take, cursor);
  const hasNextPage = comments.length > take;
  const list = hasNextPage ? comments.slice(0, -1) : comments; // 다음 페이지 있으면 마지막 요소 제외
  const nextCursor = hasNextPage ? list[list.length - 1].id : null; // list 마지막 항목 id를 nextCursor로 설정

  return { list, nextCursor };
}

async function createComment(
  content: Comment["content"],
  userId: User["id"],
  articleId?: Comment["articleId"],
  productId?: Comment["productId"]
) {
  return commentRepository.save(content, userId, articleId, productId);
}

async function updateComment(
  commentId: Comment["id"],
  data: Pick<Comment, "content">
) {
  try {
    return await commentRepository.update(commentId, data);
  } catch (error) {
    throw error;
  }
}

async function deleteComment(commentId: Comment["id"]) {
  try {
    return await commentRepository.remove(commentId);
  } catch (error) {
    throw error;
  }
}

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
