import { Request, Response } from "express";
import prisma from "../db/prisma/client.js";
import { Comment, User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

// Express의 Request 객체에 user 프로퍼티를 확장하기 위한 타입 선언
declare global {
  namespace Express {
    interface Request {
      user?: User | JwtPayload;
    }
  }
}

// 댓글 목록 조회
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);

    const comments = await prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        writer: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });

    res.json({ list: comments });
  } catch (error) {
    console.error("댓글 목록 조회 오류:", error);
    res.status(500).json({ message: "댓글 조회 실패" });
  }
};

// 댓글 작성
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user?.id;
    const { content }: { content: string } = req.body;

    if (!userId) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        productId,
        userId,
      },
      include: {
        writer: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    res.status(500).json({ message: "댓글 작성 실패" });
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.user?.id;
    const { content }: { content: string } = req.body;

    if (!userId) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing || existing.userId !== userId) {
      res.status(403).json({ message: "수정 권한이 없습니다." });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json({ comment: updated });
  } catch (error) {
    console.error("댓글 수정 오류:", error);
    res.status(500).json({ message: "댓글 수정 실패" });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing || existing.userId !== userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.json({ message: "댓글 삭제 성공" });
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    res.status(500).json({ message: "댓글 삭제 실패" });
  }
}; 