import express from "express";
import auth from "../middlewares/auth.js";
import articleService from "../services/articleService.js";
import varify from "../middlewares/varify.js";
import { authenticate } from "../middlewares/utils.js";

const articleController = express.Router();
const articleCommentController = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글 관련 API
 */

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: 게시글 등록
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 생성됨
 *   get:
 *     summary: 게시글 조회
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 */

//게시글 등록, 조회
articleController
  .route("/")
  .post(auth.varifyAccessToken, async (req, res, next) => {
    const { userId } = req.auth;
    try {
      const createdArticle = await articleService.create({
        ...req.body,
        authorId: userId,
      });
      return res.json(createdArticle);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    try {
      const articles = await articleService.getAll();
      return res.json(articles);
    } catch (error) {
      next(error);
    }
  });

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: 특정 게시글 조회 (댓글 포함)
 *     tags: [Articles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 및 댓글 반환
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 수정할 게시글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 완료
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 삭제할 게시글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 삭제 완료
 */

//게시글 상세 조회, 수정, 삭제
articleController
  .route("/:id")
  .get(authenticate, async (req, res, next) => {
    const userId = Number(req.user?.id);
    const articleId = Number(req.params.id);

    try {
      const article = await articleService.getById(articleId, userId);

      if (!article) varify.throwNotFoundError();

      const articleComments = await articleService.getAllArticleComment(
        articleId
      );

      return res.json({ article, articleComments });
    } catch (error) {
      next(error);
    }
  })
  .patch(auth.varifyAccessToken, async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const patchedArticle = await articleService.update(id, req.body);
      return res.json(patchedArticle);
    } catch (error) {
      next(error);
    }
  })
  .delete(auth.varifyAccessToken, async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const deletedArticle = await articleService.deleteById(id);
      return res.json(deletedArticle);
    } catch (error) {
      next(error);
    }
  });

/**
 * @swagger
 * /articles/{id}/comments:
 *   post:
 *     summary: 게시글에 댓글 등록
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 댓글을 등록할 게시글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 등록 성공
 *   get:
 *     summary: 특정 게시글의 댓글 목록 조회
 *     tags: [Articles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 댓글을 조회할 게시글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록 반환
 */

//게시글에 댓글 등록하기
articleCommentController
  .route("/:id/comments")
  .post(auth.varifyAccessToken, async (req, res, next) => {
    const { userId } = req.auth;
    const id = Number(req.params.id);
    try {
      const articleComment = await articleService.createArticleComment({
        ...req.body,
        articleId: id,
        authorId: userId,
      });
      return res.json(articleComment);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const articleComments = await articleService.getAllArticleComment(id);
      return res.json(articleComments);
    } catch (error) {
      next(error);
    }
  });

articleController.use("/", articleCommentController);

export default articleController;
