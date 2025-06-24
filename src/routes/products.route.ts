import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import productController from "../controllers/productController";
import commentController from "../controllers/commentController";
import { validateProduct } from "../middlewares/products/validateProduct";
import auth from "../middlewares/users/auth";

const productsRouter = express.Router();

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
 *   name: Product
 *   description: 상품 관리 API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     description: 상품 목록을 조회합니다. 액세스 토큰은 선택 사항이며, 토큰을 제공할 경우 사용자의 좋아요 여부(isLiked)를 함께 반환합니다.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: 페이지 번호
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 페이지당 상품 수
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
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
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
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
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
productsRouter.get("/", auth.verifyOptionalAuth, productController.getProducts);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     description: 특정 상품의 상세 정보를 조회합니다. 액세스 토큰은 선택 사항이며, 토큰을 제공할 경우 사용자의 좋아요 여부를 함께 반환합니다.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 조회 성공
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
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
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
 *         description: 상품을 찾을 수 없음
 */
productsRouter.get(
  "/:id",
  auth.verifyOptionalAuth,
  productController.getProductById
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 최대 3개의 이미지 파일 (선택사항)
 *     responses:
 *       201:
 *         description: 상품 등록 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */
productsRouter.post(
  "/",
  auth.verifyAccessToken,
  upload.array("images", 3),
  validateProduct,
  productController.createProduct
);

/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 최대 3개의 이미지 파일 (선택사항)
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 */
productsRouter.patch(
  "/:id",
  auth.verifyAccessToken,
  upload.array("images", 3),
  validateProduct,
  productController.updateProduct
);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 */
productsRouter.delete(
  "/:id",
  auth.verifyAccessToken,
  productController.deleteProduct
);

/**
 * @swagger
 * /products/{productId}/like:
 *   post:
 *     summary: 상품 좋아요 추가
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 추가 성공
 *       401:
 *         description: 인증 실패
 */
productsRouter.post(
  "/:productId/like",
  auth.verifyAccessToken,
  productController.likeProduct
);

/**
 * @swagger
 * /products/{productId}/like:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *       401:
 *         description: 인증 실패
 */
productsRouter.delete(
  "/:productId/like",
  auth.verifyAccessToken,
  productController.unlikeProduct
);

/**
 * @swagger
 * /products/{productId}/comments:
 *   get:
 *     summary: 상품의 댓글 목록 조회
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     description: 상품에 작성된 댓글 목록을 조회합니다. 액세스 토큰은 선택 사항이며, 제공할 경우 댓글 작성자 정보가 더 자세히 표시됩니다.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 */

productsRouter.get(
  "/:productId/comments",
  commentController.getCommentsByProductId
);

/**
 * @swagger
 * /products/{productId}/comments:
 *   post:
 *     summary: 상품에 댓글 작성
 *     tags: [Product]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: string
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
 *                 example: 상품 댓글 내용입니다.
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 */

productsRouter.post(
  "/:productId/comments",
  auth.verifyAccessToken,
  commentController.createProductComment
);

export default productsRouter;
