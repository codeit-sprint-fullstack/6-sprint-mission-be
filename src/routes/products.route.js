import express from "express";
import productController from "../controllers/productController.js";
import commentController from "../controllers/commentController.js";
import { validateProduct } from "../middlewares/products/validateProduct.js";
import auth from "../middlewares/users/auth.js";

const productsRouter = express.Router();

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
 *       - bearerAuth: []
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
 */
productsRouter.get("/", auth.verifyOptionalAuth, productController.getProducts);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
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
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
