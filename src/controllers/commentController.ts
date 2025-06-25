import { Request, NextFunction, Response } from "express";
import commentService from "../services/commentService";

// 상품에 댓글 생성
export async function createComment(
  req: Request<{ id: string }, {}, { content: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { content } = req.body;
    const productId = Number(req.params.id);
    const userId = req.auth.userId;

    if (!content) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    const comment = await commentService.createComment({
      content,
      productId,
      userId,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

// 상품의 댓글 목록 조회
export async function getProductComments(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.id);
    const comments = await commentService.getCommentsByProductId(productId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

// 댓글 수정
export async function updateComment(
  req: Request<{ commentId: string }, {}, { content: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { content } = req.body;
    const commentId = Number(req.params.commentId);
    const userId = req.auth.userId;

    if (!content) {
      res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      return;
    }

    const comment = await commentService.updateComment({
      id: commentId,
      content,
      userId,
    });

    res.json(comment);
  } catch (err) {
    next(err);
  }
}

// 댓글 삭제
export async function deleteComment(
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.auth.userId;

    await commentService.deleteComment(commentId, userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
