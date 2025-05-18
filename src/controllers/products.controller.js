const express = require("express");
const productService = require("../services/products.service");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const validateProduct = require("../middlewares/validateProduct");

const productsController = express.Router();

/**
 * POST
 */
productsController.post(
  "/",
  auth.verifyAccessToken,
  upload.array("images", 3),
  validateProduct,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { name, description, price, tags = [] } = req.body;

      const imagePaths = req.files.map((file) => `${file.filename}`);

      const newProduct = await productService.createProduct(
        {
          name,
          description,
          price,
          tags: Array.isArray(tags) ? tags : [tags],
          images: imagePaths,
        },
        userId
      );

      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 전체 GET
 */
productsController.get("/", async (req, res, next) => {
  try {
    const products = await productService.getAll(req.query);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

/**
 * GET
 */
productsController.get("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const product = await productService.getProduct(productId);

    if (!product)
      res.status(404).json({ message: "해당 게시글은 존재하지 않습니다." });

    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE
 */
productsController.delete(
  "/:productId",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const productId = Number(req.params.productId);

      if (!userId) {
        const error = new Error(
          "로그인한 사용자만 게시글을 삭제할 수 있습니다."
        );
        error.code = 401;
        throw error;
      }

      const product = await productService.deleteProduct(productId);

      if (!product) {
        const error = new Error("해당 게시글이 존재하지 않습니다.");
        error.code = 404;
        throw error;
      }

      if (userId !== product.authorId) {
        const error = new Error("본인의 게시글만 삭제할 수 있습니다.");
        error.code = 401;
        throw error;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH
 */
productsController.patch(
  "/:productId",
  auth.verifyAccessToken,
  upload.array("images", 3),
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const productId = Number(req.params.productId);

      if (!userId) {
        const error = new Error(
          "로그인한 사용자만 게시글을 삭제할 수 있습니다."
        );
        error.code = 401;
        throw error;
      }

      const { name, description, price, tags = [] } = req.body;

      // 이전에 올린 이미지는 req.files에 담겨 있음
      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map((file) => file.filename);
      }

      const product = await productService.updateProduct(
        productId,
        {
          name,
          description,
          price,
          tags: Array.isArray(tags) ? tags : [],
          images: imagePaths,
        },
        userId
      );

      if (!product) {
        const error = new Error("해당 게시글이 존재하지 않습니다.");
        error.code = 404;
        throw error;
      }

      if (userId !== product.authorId) {
        const error = new Error("본인의 게시글만 수정할 수 있습니다.");
        error.code = 403;
        throw error;
      }

      res.status(200).json({ product });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 좋아요 생성
 */
productsController.post(
  "/:productId/likes",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const productId = Number(req.params.productId);
      const userId = req.user.userId;

      const result = await productService.createProductLike(userId, productId);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 좋아요 삭제
 */
productsController.delete(
  "/:productId/likes",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const productId = Number(req.params.productId);
      const userId = req.user.userId;

      await productService.deleteProductLike(userId, productId);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = productsController;
