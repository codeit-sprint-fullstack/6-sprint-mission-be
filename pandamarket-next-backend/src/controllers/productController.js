import commentService from "../services/commentService.js";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";
import express from "express";
import uploads from "../middlewares/multer.js";

const productController = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: 정렬 기준
 *     responses:
 *       200:
 *         description: 상품 목록 반환
 */
productController.get("/", async (req, res, next) => {
  try {
    const { keyword, orderBy } = req.query;
    const products = await productService.getProducts(keyword, orderBy);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 정보 반환
 */
productController.get(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.auth.userId;
      const products = await productService.getById(id, userId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
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
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 상품 생성됨
 */
productController.post(
  "/",
  uploads.single("image"),
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      let { name, description, price, tags } = req.body;
      const userId = req.auth.userId;
      if (!name || !description || !price) {
        const error = new Error("모두 필요합니다.");
        error.code = 422;
        throw error;
      }
      price = Number(price);
      if (!tags) {
        tags = [];
      } else if (typeof tags === "string") {
        tags = [tags];
      }
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const product = await productService.createProduct({
        name,
        description,
        price,
        tags,
        image: imagePath,
        userId,
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     requestBody:
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
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 상품 수정 완료
 */
productController.patch(
  "/:id",
  auth.verifyAccessToken,
  uploads.single("image"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      let { name, description, price, tags } = req.body;
      const userId = req.auth.userId;
      const product = await productService.getById(id);
      if (!product) {
        const error = new Error("수정하려는 물건이 존재하지 않습니다.");
        error.code = 422;
        throw error;
      }
      if (product.userId !== userId) {
        const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
        error.code = 401;
        throw error;
      }
      price = Number(price);
      if (!tags) {
        tags = [];
      } else if (typeof tags === "string") {
        tags = [tags];
      }
      const imagePath = req.file
        ? `/uploads/${req.file.filename}`
        : product.image;
      const updatedProduct = await productService.patchProduct(id, {
        name,
        description,
        price,
        tags,
        image: imagePath,
      });
      res.status(201).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 상품 삭제 완료
 */
productController.delete(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.auth.userId;
      const product = await productService.getById(id);
      if (!product) {
        const error = new Error("삭제하려는 물건이 존재하지 않습니다.");
        error.code = 422;
        throw error;
      }
      if (product.userId !== userId) {
        const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
        error.code = 401;
        throw error;
      }
      await productService.deleteProduct(id);
      res.status(201).json();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /products/{id}/comments:
 *   post:
 *     summary: 상품에 댓글 추가
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       201:
 *         description: 댓글 등록 완료
 */
productController.post(
  "/:id/comments",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { content } = req.body;
      const userId = req.auth.userId;
      if (!content) {
        const error = new Error("내용 필요합니다.");
        error.code = 422;
        throw error;
      }
      const type = "product";
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

/**
 * @swagger
 * /products/{id}/favorite:
 *   post:
 *     summary: 상품 좋아요 추가
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 추가됨
 */
productController.post(
  "/:id/favorite",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.auth.userId;
      const createdFavorite = await productService.postFavorite(id, userId);
      return res.status(201).json(createdFavorite);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /products/{id}/favorite:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 취소됨
 */
productController.delete(
  "/:id/favorite",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.auth.userId;
      const deletedFavorite = await productService.deleteFavorite(id, userId);
      return res.status(201).json(deletedFavorite);
    } catch (error) {
      next(error);
    }
  }
);

export default productController;
