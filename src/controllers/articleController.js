import express from "express";
import auth from "../middlewares/auth.js";
import articleService from "../services/articleService.js";
import upload from "../middlewares/multer.js";

const articleController = express.Router();

/**
 * 자유게시글 생성
 */
articleController.post(
  "/",
  auth.verifyAccessToken,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const authorId = req.user.userId;

      const articleData = {
        ...req.body,
        image: imagePath,
        authorId,
      };

      const createdArticle = await articleService.create(articleData);
      return res.status(201).json(createdArticle);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 전체 자유게시글 조회
 */
articleController.get("/", async (req, res, next) => {
  try {
    const articles = await articleService.getAll();
    return res.json(articles);
  } catch (err) {
    next(err);
  }
});

/**
 * 자유게시글 단건 조회
 */
articleController.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await articleService.getById(id);
    return res.json(article);
  } catch (err) {
    next(err);
  }
});

/**
 * 자유게시글 수정
 */
articleController.put(
  "/:id",
  auth.verifyAccessToken,
  auth.checkPostOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await articleService.updateById(id, req.body);
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 자유게시글 삭제
 */
articleController.delete(
  "/:id",
  auth.verifyAccessToken,
  auth.checkPostOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await articleService.deleteById(id);
      return res.json(deleted);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 자유게시글 좋아요 추가
 */
articleController.post(
  "/:id/like",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const articleId = Number(req.params.id);
      await articleService.addLike(userId, articleId);
      return res.status(200).json({ message: "좋아요가 눌러졌습니다." });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 자유게시글 좋아요 취소
 */
articleController.delete(
  "/:id/like",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const articleId = Number(req.params.id);
      await articleService.removeLike(userId, articleId);
      return res.status(200).json({ message: "좋아요가 취소되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 유저가 좋아요 눌렀는지 확인
 */
articleController.get(
  "/:id/like",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const articleId = Number(req.params.id);
      const hasLiked = await articleService.hasUserLiked(userId, articleId);
      return res.status(200).json({ liked: hasLiked });
    } catch (err) {
      next(err);
    }
  }
);

export default articleController;
