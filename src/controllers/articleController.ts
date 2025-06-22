import { NextFunction, Request, RequestHandler, Response } from "express";
import articleService from "../services/articleService";

// 게시글 생성
export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content } = req.body;
    const userId = req.auth.userId;

    if (!title || !content) {
      res.status(400).json({ message: "제목과 내용은 필수입니다." });
      return;
    }
    if (!userId) {
      res.status(401).json({ message: "로그인이 필요합니다." });
      return;
    }

    const article = await articleService.createArticle({
      title,
      content,
      userId, // Now guaranteed to be number type
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 목록 조회
export const getAllArticles: RequestHandler = async (req, res, next) => {
  try {
    const articles = await articleService.getAllArticles();
    res.json({
      data: articles,
      total: articles.length,
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 상세 조회
export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.articleId);
    if (isNaN(id)) {
      res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
      return;
    }
    const userId = req.auth?.userId;

    if (!userId) {
      res.status(401).json({ message: "인증 정보가 없습니다." });
      return;
    }

    const article = await articleService.getArticleById(id, userId);

    if (!article) {
      res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      return;
    }

    res.json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.articleId);
    const { title, content } = req.body;
    const userId = req.auth.userId;

    if (!userId) {
      res.status(401).json({ message: "인증 정보가 없습니다." });
      return;
    }

    if (!title && !content) {
      res.status(400).json({ message: "수정할 내용이 없습니다." });
      return;
    }

    const updated = await articleService.updateArticle({
      id,
      userId,
      title,
      content,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// 게시글 삭제
export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.articleId);
    const userId = req.auth.userId;

    if (!userId) {
      res.status(401).json({ message: "인증 정보가 없습니다." });
      return;
    }

    await articleService.deleteArticle(id, userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요
export const likeArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = Number(req.params.articleId);
    const userId = req.auth.userId;

    if (!userId) {
      res.status(401).json({ message: "인증 정보가 없습니다." });
      return;
    }

    const result = await articleService.likeArticle(articleId, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// 게시글 좋아요 취소
export const unlikeArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = Number(req.params.articleId);
    const userId = req.auth.userId;

    if (!userId) {
      res.status(401).json({ message: "인증 정보가 없습니다." });
      return;
    }

    const result = await articleService.unlikeArticle(articleId, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
