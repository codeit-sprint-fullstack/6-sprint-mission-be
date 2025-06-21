import express, { Request, Response, NextFunction } from "express";
import articleService from "../services/articleService";
import auth from "../middlewares/auth";
import uploads from "../middlewares/multer";
import { TError } from "../types/error";
import { CreateArticleDto, UpdateArticleDto } from "../dtos/article.dto";
import commentService from "../services/commentService";
import { CreateCommentDto } from "../dtos/comment.dto";
const articleController = express.Router();

articleController.get(
  "/",
  async (
    req: Request<
      {},
      {},
      {},
      { keyword: string; orderBy: "recent" | "favorite" }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { keyword, orderBy } = req.query;
      const articles = await articleService.getArticles(keyword, orderBy);
      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  }
);

articleController.get(
  "/:id",
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const items = await articleService.getById(id, userId);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }
);

articleController.post(
  "/",
  uploads.array("images", 3),
  auth.verifyAccessToken,
  async (
    req: Request<{}, {}, CreateArticleDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { title, content } = req.body;
      const userId = req.auth?.userId as string;
      if (!title || !content) {
        const error = new Error("모두 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }
      let imagePaths = [] as string[];
      const files = req.files as Express.Multer.File[];
      if (files.length > 0) {
        imagePaths = files.map((file) => `/uploads/${file.filename}`);
      }
      const item = await articleService.createArticle({
        title,
        content,
        images: imagePaths,
        userId,
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
);

articleController.get(
  "/:id",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const items = await articleService.getById(id, userId);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }
);

articleController.post(
  "/",
  uploads.array("images", 3),
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      let { title, content } = req.body;
      const userId = req.auth?.userId as string;
      if (!title || !content) {
        const error = new Error("모두 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }

      let imagePaths = [] as string[];
      const files = req.files as Express.Multer.File[];
      if (files.length > 0) {
        imagePaths = files.map((file) => `/uploads/${file.filename}`);
      }
      const item = await articleService.createArticle({
        title,
        content,
        images: imagePaths,
        userId,
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
);

articleController.patch(
  "/:id",
  auth.verifyAccessToken,
  uploads.array("images", 3),
  async (
    req: Request<{ id: string }, {}, UpdateArticleDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      let { title, content } = req.body;
      const userId = req.auth?.userId as string;
      const item = await articleService.getById(id, userId);
      if (!item) {
        const error = new Error(
          "수정하려는 물건이 존재하지 않습니다."
        ) as TError;
        error.code = 422;
        throw error;
      }
      if (item.userId !== userId) {
        const error = new Error(
          "권한이 없습니다.-작성자가 아닙니다."
        ) as TError;
        error.code = 401;
        throw error;
      }

      let imagePaths = item.images;
      const files = req.files as Express.Multer.File[];
      if (files.length > 0) {
        imagePaths = files.map((file) => `/uploads/${file.filename}`);
      }
      const updatedItem = await articleService.patchArticle(id, {
        title,
        content,
        images: imagePaths,
      });
      res.status(201).json(updatedItem);
    } catch (error) {
      next(error);
    }
  }
);

articleController.delete(
  "/:id",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;

      const item = await articleService.getById(id, userId);
      if (!item) {
        const error = new Error(
          "삭제하려는 물건이 존재하지 않습니다."
        ) as TError;
        error.code = 422;
        throw error;
      }
      if (item.userId !== userId) {
        const error = new Error(
          "권한이 없습니다.-작성자가 아닙니다."
        ) as TError;
        error.code = 401;
        throw error;
      }
      await articleService.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

articleController.post(
  "/:id/comments",
  auth.verifyAccessToken,
  async (
    req: Request<{ id: string }, {}, CreateCommentDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { content } = req.body;
      const userId = req.auth?.userId as string;
      if (!content) {
        const error = new Error("내용 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }
      const type = "item";
      const comment = await commentService.createComment(
        type,
        id,
        userId,
        content
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

articleController.post(
  "/:id/favorite",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const createdFavorite = await articleService.postFavorite(id, userId);
      res.status(201).json(createdFavorite);
    } catch (error) {
      next(error);
    }
  }
);

articleController.delete(
  "/:id/favorite",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const deletedFavorite = await articleService.deleteFavorite(id, userId);
      res.status(201).json(deletedFavorite);
    } catch (error) {
      next(error);
    }
  }
);

export default articleController;
