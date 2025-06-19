import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import articleController from "../controllers/articleController";
import auth from "../middlewares/users/auth";

const articlesRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // UUID를 사용하여 안전한 파일명 생성
    const ext = file.originalname.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 관련 API
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Article]
 *     security:
 *       - accessToken: []
 *     description: 게시글 목록을 조회합니다. 액세스 토큰은 선택 사항이며, 토큰을 제공할 경우 사용자의 좋아요 여부(isLiked)를 함께 반환합니다.
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
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           nickname:
 *                             type: string
 *                           image:
 *                             type: string
 *                             nullable: true
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
 *     tags: [Article]
 *     security:
 *       - accessToken: []
 *     description: 특정 게시글의 상세 정보를 조회합니다. 액세스 토큰은 선택 사항이며, 토큰을 제공할 경우 사용자의 좋아요 여부(isLiked)를 함께 반환합니다.
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
 *                     author:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nickname:
 *                           type: string
 *                         image:
 *                           type: string
 *                           nullable: true
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
 *     tags: [Article]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 최대 3개의 이미지 파일을 업로드할 수 있습니다.
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
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: integer
 *                     author:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nickname:
 *                           type: string
 *                         image:
 *                           type: string
 *                           nullable: true
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
  upload.array("images", 3),
  articleController.createArticle
);

/**
 * @swagger
 * /articles/{articleId}:
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Article]
 *     security:
 *       - accessToken: []
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 수정된 게시글 제목
 *               content:
 *                 type: string
 *                 example: 수정된 게시글 내용입니다.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 최대 3개의 이미지 파일을 업로드할 수 있습니다.
 *               existingImages:
 *                 type: string
 *                 format: json
 *                 example: "['/uploads/image1.jpg', '/uploads/image2.jpg']"
 *                 description: 유지할 기존 이미지 경로의 JSON 배열
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
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: integer
 *                     author:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nickname:
 *                           type: string
 *                         image:
 *                           type: string
 *                           nullable: true
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
  upload.array("images", 3),
  articleController.updateArticle
);

/**
 * @swagger
 * /articles/{articleId}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Article]
 *     security:
 *       - accessToken: []
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
 *     tags: [Article]
 *     security:
 *       - accessToken: []
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
 *     tags: [Article]
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
 *     tags: [Article]
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
// articlesRouter.patch(
//   "/:articleId/like",
//   auth.verifyAccessToken,
//   articleController.increaseLike
// );

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
