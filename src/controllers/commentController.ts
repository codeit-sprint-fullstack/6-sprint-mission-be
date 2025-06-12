import { ForbiddenError } from "../types/exceptions";
import { NextFunction, Request, Response } from "express";
import { Comment } from "@prisma/client";
import commentService from "../services/commentService";

interface CommentParams {
  articleId?: string;
  productId?: string;
}

interface CommentQuery {
  cursor?: number;
  limit?: number;
}

interface CommentListResponse {
  list: Comment[];
  nextCursor: number | null;
}

// 댓글 목록 조회
export async function getComments(
  req: Request<CommentParams, {}, {}, CommentQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const articleIdParam = req.params.articleId
      ? Number(req.params.articleId)
      : null;
    const productIdParam = req.params.productId
      ? Number(req.params.productId)
      : null;
    const { cursor, limit } = req.query;
    const take = Number(limit) || 3;

    const comments: CommentListResponse = await commentService.getComments({
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

// 댓글 등록
export async function createComment(
  req: Request<CommentParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { content } = req.body;
    const userId = Number(req.auth.userId);

    const articleId = req.params.articleId
      ? Number(req.params.articleId)
      : null;
    const productId = req.params.productId
      ? Number(req.params.productId)
      : null;

    const comment = await commentService.createComment(
      articleId,
      productId,
      content,
      userId
    );

    const {
      articleId: _articleId, // 구조 분해 시 이름 충돌 방지
      productId: _productId,
      writerId,
      ...rest
    } = comment;
    res.status(201).json(rest);
  } catch (e) {
    next(e);
  }
}

// 댓글 수정
export async function updateComment(
  req: Request<
    { commentId: string },
    {},
    { content: Pick<Comment, "content"> }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.auth.userId);
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    const comment = await commentService.updateComment(commentId, content);
    if (userId !== comment.writer.id) {
      throw new ForbiddenError("댓글 작성자만 수정할 수 있습니다.");
    }
    const { articleId, productId, writerId, ...rest } = comment;
    res.json(rest);
  } catch (e) {
    next(e);
  }
}

// 댓글 삭제
export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.auth.userId);
    const commentId = Number(req.params.commentId);
    const comment = await commentService.deleteComment(commentId);
    if (userId !== comment.writerId) {
      throw new ForbiddenError("댓글 작성자만 삭제할 수 있습니다.");
    }
    res.json({ id: commentId });
  } catch (e) {
    next(e);
  }
}
