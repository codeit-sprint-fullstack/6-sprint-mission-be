import express from "express";
import articleController from "../controllers/articleController.js";
import auth from "../middlewares/users/auth.js";

const articlesRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글 관련 API
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Articles]
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: 페이지네이션 시작 위치
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: 한 페이지당 게시글 수
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: search
 *         in: query
 *         description: 검색어 (제목, 내용에서 검색)
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: 정렬 방식 (latest:최신순, popular:인기순)
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *           default: latest
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       likes:
 *                         type: integer
 *                       isLiked:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *                 sort:
 *                   type: string
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
articlesRouter.get("/", auth.verifyOptionalAuth, articleController.getArticles);

/**
 * @swagger
 * /articles/{articleId}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [Articles]
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     likes:
 *                       type: integer
 *                     isLiked:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
articlesRouter.get(
  "/:articleId",
  auth.verifyOptionalAuth,
  articleController.getArticleById
);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: 게시글 생성
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
 *                 example: 게시글 제목
 *               content:
 *                 type: string
 *                 example: 게시글 내용입니다.
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 성공적으로 등록되었습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     likes:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
articlesRouter.post(
  "/",
  auth.verifyAccessToken,
  articleController.createArticle
);

/**
 * @swagger
 * /articles/{articleId}:
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 수정된 게시글 제목
 *               content:
 *                 type: string
 *                 example: 수정된 게시글 내용입니다.
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 성공적으로 수정되었습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     likes:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
articlesRouter.patch(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.updateArticle
);

/**
 * @swagger
 * /articles/{articleId}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 성공적으로 삭제되었습니다.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
articlesRouter.delete(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.deleteArticle
);

/**
 * @swagger
 * /articles/{articleId}/like:
 *   patch:
 *     summary: 게시글 좋아요 증가
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 좋아요 증가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글에 좋아요를 눌렀습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     likes:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: 게시글 좋아요 누르기
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 게시글 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 좋아요 완료
 *                 liked:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: 게시글 좋아요 취소
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 좋아요 취소 완료
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
articlesRouter.patch(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.increaseLike
);

// 좋아요
articlesRouter.post(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.likeArticle
);
articlesRouter.delete(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.unlikeArticle
);

export default articlesRouter;
