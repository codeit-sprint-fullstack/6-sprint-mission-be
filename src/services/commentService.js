import { NotFoundError } from "../exceptions.js";
import commentRepository from "../repositories/commentRepository.js";

async function getComments({ articleId, productId, cursor, take }) {
  const where = articleId ? { articleId } : productId ? { productId } : {};
  const comments = await commentRepository.findAll(where, take, cursor);
  const hasNextPage = comments.length > take;
  const list = hasNextPage ? comments.slice(0, -1) : comments; // 다음 페이지 있으면 마지막 요소 제외
  const nextCursor = hasNextPage ? list[list.length - 1].id : null; // list 마지막 항목 id를 nextCursor로 설정

  return { list, nextCursor };
}

async function createComment({ articleId, productId, content, userId }) {
  return commentRepository.save(articleId, productId, content, userId);
}

async function updateComment(commentId, data) {
  try {
    return await commentRepository.update(commentId, data);
  } catch (e) {
    if (e.code === "P2025") {
      // Record not found 에러
      throw new NotFoundError("댓글을 찾을 수 없습니다.");
    }
    throw e;
  }
}

async function deleteComment(commentId) {
  try {
    return await commentRepository.remove(commentId);
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("댓글을 찾을 수 없습니다.");
    }
  }
}

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
