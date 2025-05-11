import express from "express";
import productController from "../controllers/productController.js";
import { validateProduct } from "../middlewares/products/validateProduct.js";
import auth from "../middlewares/users/auth.js";

const productsRouter = express.Router();

// 일반 상품 관련
productsRouter.get("/", auth.verifyOptionalAuth, productController.getProducts);
productsRouter.get(
  "/:id",
  auth.verifyOptionalAuth,
  productController.getProductById
);

productsRouter.post(
  "/",
  auth.verifyAccessToken,
  validateProduct,
  productController.createProduct
);
productsRouter.patch(
  "/:id",
  auth.verifyAccessToken,
  validateProduct,
  productController.updateProduct
);
productsRouter.delete(
  "/:id",
  auth.verifyAccessToken,
  productController.deleteProduct
);

// 좋아요 관련
productsRouter.post(
  "/:productId/like",
  auth.verifyAccessToken,
  productController.likeProduct
);

productsRouter.delete(
  "/:productId/like",
  auth.verifyAccessToken,
  productController.unlikeProduct
);

export default productsRouter;
