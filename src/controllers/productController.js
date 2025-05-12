import express from "express";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";
import upload from "../middlewares/multer.js";

const productController = express.Router();

/**
 *  상품 생성
 */
productController.post(
  "/",
  auth.verifyAccessToken,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const authorId = req.user.userId;

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const productData = {
        ...req.body,
        price: Number(req.body.price),
        tags: req.body.tags || [], // 프론트에서 JSON 문자열로 보내면
        images: imagePath,
        authorId,
      };

      console.log("Product data before creation:", productData); // productData 로그 추가

      const createdProduct = await productService.create(productData);
      return res.status(201).json(createdProduct);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 전체 상품 조회
 */
productController.get("/", async (req, res, next) => {
  try {
    const products = await productService.getAll();
    return res.json(products);
  } catch (err) {
    next(err);
  }
});

/**
 * 상품 단건 조회
 */
productController.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getById(id);
    return res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * 상품 수정
 */
productController.put(
  "/:id",
  auth.verifyAccessToken,
  auth.checkProductOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await productService.updateById(id, req.body);
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 상품 삭제
 */
productController.delete(
  "/:id",
  auth.verifyAccessToken,
  auth.checkProductOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteById(id);
      return res.json(deleted);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 상품 좋아요 추가
 */
productController.post(
  "/:id/like",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const productId = Number(req.params.id);
      await productService.addLike(userId, productId);
      return res.status(200).json({ message: "좋아요가 눌러졌습니다." });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 상품 좋아요 취소
 */
productController.delete(
  "/:id/like",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const productId = parseInt(req.params.id, 10);
      await productService.removeLike(userId, productId);
      return res.status(200).json({ message: "좋아요가 취소되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 유저가 좋아요 눌렀는지 확인
 */
productController.get(
  "/:id/like",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const productId = parseInt(req.params.id, 10);
      const hasLiked = await productService.hasUserLiked(userId, productId);
      return res.status(200).json({ liked: hasLiked });
    } catch (err) {
      next(err);
    }
  }
);

export default productController;
