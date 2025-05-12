import { ForbiddenError } from "../exceptions.js";
import commentService from "../services/commentService.js";

/**
 * 댓글 목록 조회
 */
export async function getComments(req, res, next) {
  try {
    const articleIdParam = req.params.articleId
      ? Number(req.params.articleId)
      : null;
    const productIdParam = req.params.productId
      ? Number(req.params.productId)
      : null;
    const { cursor, limit } = req.query;
    const take = Number(limit) || 10;

    const comments = await commentService.getComments({
      articleId: articleIdParam,
      productId: productIdParam,
      take,
      cursor,
    });

    const commentList = comments.list.map(
      ({ articleId, productId, writerId, ...rest }) => rest
    );
    res.json({ nextCursor: comments.nextCursor, list: commentList });
  } catch (e) {
    next(e);
  }
}

/**
 * 댓글 등록
 */
export async function createComment(req, res, next) {
  try {
    const { content } = req.body;
    const userId = req.auth.userId;
    const articleIdParam = req.params.articleId
      ? Number(req.params.articleId)
      : null;
    const productIdParam = req.params.productId
      ? Number(req.params.productId)
      : null;

    const comment = await commentService.createComment({
      articleId: articleIdParam,
      productId: productIdParam,
      content,
      userId,
    });

    const { articleId, productId, writerId, ...rest } = comment;
    res.status(201).json(rest);
  } catch (e) {
    next(e);
  }
}

/**
 * 댓글 수정
 */
export async function updateComment(req, res, next) {
  try {
    const userId = req.auth.userId;
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    const comment = await commentService.updateComment(commentId, {
      content,
    });
    if (userId !== comment.writer.id) {
      throw new ForbiddenError("댓글 작성자만 수정할 수 있습니다.");
    }
    const { articleId, productId, writerId, ...rest } = comment;
    res.json(rest);
  } catch (e) {
    next(e);
  }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(req, res, next) {
  try {
    const userId = req.auth.userId;
    const commentId = Number(req.params.commentId);
    if (!commentId) throw new Error("댓글 ID는 숫자여야 합니다.");
    const comment = await commentService.deleteComment(commentId);
    if (userId !== comment.writerId) {
      throw new ForbiddenError("댓글 작성자만 삭제할 수 있습니다.");
    }
    res.json({ id: commentId });
  } catch (e) {
    next(e);
  }
}
