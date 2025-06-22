import { Request, Response, NextFunction } from "express";
import articleService from "../services/article.service";
import {
  ArticleResponseDto,
  CreateArticleDto,
  UpdateArticleDto,
} from "../Types/article";
import { AuthRequest } from "../Types/user";

const articleController = {
  createArticle: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.auth?.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { title, content, images }: CreateArticleDto = req.body;

      const newArticle: ArticleResponseDto = await articleService.createArticle(
        req.auth.userId,
        title,
        content,
        images
      );

      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  },

  getArticles: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pageParam = req.query.page;
      const pageSizeParam = req.query.pageSize;
      const orderByParam = req.query.orderBy;
      const keywordParam = req.query.keyword;

      const page = pageParam ? parseInt(pageParam as string, 10) : 1;
      const limit = pageSizeParam ? parseInt(pageSizeParam as string, 10) : 10;
      const sort = typeof orderByParam === "string" ? orderByParam : "recent";
      const search = typeof keywordParam === "string" ? keywordParam : "";

      if (isNaN(page) || isNaN(limit)) {
        res.status(400).json({ message: "Invalid pagination parameters" });
        return;
      }

      const articles: ArticleResponseDto[] = await articleService.getArticles(
        sort,
        search,
        page,
        limit
      );

      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  },

  getArticleById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const articleId = parseInt(req.params.articleId, 10);

      if (isNaN(articleId)) {
        res.status(400).json({ message: "Invalid article ID" });
        return;
      }

      const article: ArticleResponseDto = await articleService.getArticleById(
        articleId
      );

      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  },

  updateArticle: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.auth?.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const articleId = parseInt(req.params.articleId, 10);
      const { title, content, images }: UpdateArticleDto = req.body;

      if (isNaN(articleId)) {
        res.status(400).json({ message: "Invalid article ID" });
        return;
      }

      const updatedArticle: ArticleResponseDto =
        await articleService.updateArticle(
          articleId,
          req.auth.userId,
          title,
          content,
          images
        );

      res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  },

  deleteArticle: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.auth?.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const articleId = parseInt(req.params.articleId, 10);

      if (isNaN(articleId)) {
        res.status(400).json({ message: "Invalid article ID" });
        return;
      }

      await articleService.deleteArticle(articleId, req.auth.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export default articleController;
