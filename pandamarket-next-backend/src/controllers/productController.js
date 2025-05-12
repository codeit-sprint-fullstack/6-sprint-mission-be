import commentService from "../services/commentService.js";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";
import express from "express";
import uploads from "../middlewares/multer.js";

const productController = express.Router();

productController.get("/", async (req, res, next) => {
  try {
    const { keyword, orderBy } = req.query;
    const products = await productService.getProducts(keyword, orderBy);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

productController.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const products = await productService.getById(id);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

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

export default productController;
