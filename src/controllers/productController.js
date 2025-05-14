import express from "express";
import productService from "../services/productService.js";
import varify from "../middlewares/varify.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/images.js";
import { authenticate } from "../middlewares/utils.js";
import jwt from "jsonwebtoken";

const productController = express.Router();
const productCommentController = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 및 상품 댓글 관련 API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: string
 *                 example: ["태그1", "태그2"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 상품 등록 성공
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 전체 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [recent, favorite]
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 상품 검색 키워드
 *     responses:
 *       200:
 *         description: 상품 목록 반환
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 정보 및 댓글 목록 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: 수정된 상품 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제된 상품 정보 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /products/{id}/comments:
 *   post:
 *     summary: 상품에 댓글 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 등록된 댓글 반환
 */

/**
 * @swagger
 * /products/{id}/comments:
 *   get:
 *     summary: 상품 댓글 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록 반환
 */

// 상품 등록, 전체 상품 조회
productController
  .route("/")
  .post(
    auth.varifyAccessToken,
    upload.single("image"),
    async (req, res, next) => {
      try {
        const parsedTags = (() => {
          try {
            const tags = JSON.parse(req.body.tags);
            return Array.isArray(tags) ? tags : [tags];
          } catch (e) {
            return [req.body.tags];
          }
        })();

        const accessToken = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;

        const data = {
          name: req.body.name,
          description: req.body.description,
          price: Number(req.body.price),
          tags: parsedTags,
          imageUrl: req.file
            ? `http://localhost:3000/uploads/${req.file.filename}`
            : null,
          authorId: userId,
        };

        const createProduct = await productService.create(data);

        return res.json(createProduct);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(async (req, res, next) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        orderBy = "recent",
        keyword = "",
      } = req.query;

      const take = parseInt(pageSize);
      const skip = (parseInt(page) - 1) * take;
      const orderField =
        orderBy === "recent"
          ? "createdAt"
          : orderBy === "favorite"
          ? "favorite"
          : "createdAt";

      const validOrderOption = ["recent", "favorite"];
      if (!validOrderOption.includes(orderBy)) {
        return res.status(400).json({ message: "잘못된  요청입니다." });
      }

      const product = await productService.getAll({
        order: orderField,
        skip,
        take,
        keyword,
      });

      if (!product) varify.throwNotFoundError();

      return res.json(product);
    } catch (error) {
      next(error);
    }
  });

//상품 상세 조회
productController.get("/:id", authenticate, async (req, res, next) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    const product = await productService.getById(id, userId);

    if (!product) varify.throwNotFoundError();

    const productCommets = await productService.getAllProductComment(id);

    return res.json({ product, productCommets });
  } catch (error) {
    next(error);
  }
});

//상품 수정, 삭제하기
productController
  .route("/:id")
  .all(auth.varifyAccessToken)
  .patch(async (req, res, next) => {
    const id = Number(req.params.id);
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    try {
      const updatedProduct = await productService.update(id, req.body);

      if (!updatedProduct) varify.throwNotFoundError();

      return res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const deletedProduct = await productService.deleteById(id);
    try {
      if (!deletedProduct) {
        const error = new Error("존재하지 않는 상품입니다.");
        error.code = 404;
        throw error;
      }

      return res.json(deletedProduct);
    } catch (error) {
      next(error);
    }
  });

//상품에 댓글등록, 가져오기
productCommentController
  .route("/:id/comments")
  .post(auth.varifyAccessToken, async (req, res, next) => {
    const { userId } = req.auth;
    const id = Number(req.params.id);
    try {
      const createdComment = await productService.createProductComment({
        ...req.body,
        productId: id,
        authorId: userId,
      });
      return res.json(createdComment);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const productComments = await productService.getAllProductComment(id);
      return res.json(productComments);
    } catch (error) {
      next(error);
    }
  });

//중복 컨트롤러 병합
productController.use("/", productCommentController);

export default productController;
