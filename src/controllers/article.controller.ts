import { Request, Response } from "express";
import prisma from "../db/prisma/client.js";

// 게시글 목록 조회
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({
      include: { user: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: articles });
  } catch (error) {
    res.status(500).json({ message: "게시글 목록 조회 실패", error });
  }
};

// 게시글 상세 조회
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: { user: true, likes: true },
    });
    if (!article) {
      res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      return;
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "게시글 조회 실패", error });
  }
};

// 게시글 작성
export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, userId, images } = req.body;
    const article = await prisma.article.create({
      data: { title, content, userId, images },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: "게시글 작성 실패", error });
  }
};

// 게시글 수정
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, images } = req.body;
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: { title, content, images },
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "게시글 수정 실패", error });
  }
};

// 게시글 삭제
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id: Number(id) } });
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "게시글 삭제 실패", error });
  }
}; 