import express from "express";
import productController from "../controllers/productController.js";
import commentController from "../controllers/commentController.js";
import { validateProduct } from "../middlewares/products/validateProduct.js";
import auth from "../middlewares/users/auth.js";

const productsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 관리 API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
 * /api/products/{id}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 * /api/products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Products]
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
 * /api/products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 * /api/products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 * /api/products/{productId}/like:
 *   post:
 *     summary: 상품 좋아요 추가
 *     tags: [Products]
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
 * /api/products/{productId}/like:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Products]
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
 * /api/products/{productId}/comments:
 *   get:
 *     summary: 상품 댓글 목록 조회
 *     tags: [Products, Comments]
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
 * /api/products/{productId}/comments:
 *   post:
 *     summary: 상품 댓글 작성
 *     tags: [Products, Comments]
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
 *                 description: 댓글 내용
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
