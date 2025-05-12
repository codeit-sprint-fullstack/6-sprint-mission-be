import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  likeProduct,
  unlikeProduct,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import { productValidator, validate } from "../middlewares/validator.js";
import commentRouter from "./commentRouter.js";

const productRouter = express.Router();

productRouter.get("/", auth.verifyAccessToken, getProducts);
productRouter.post(
  "/",
  auth.verifyAccessToken,
  productValidator,
  validate,
  createProduct
);
productRouter.get("/:productId", auth.verifyAccessToken, getProduct);
productRouter.patch(
  "/:productId",
  auth.verifyAccessToken,
  productValidator,
  validate,
  updateProduct
);
productRouter.delete("/:productId", auth.verifyAccessToken, deleteProduct);
productRouter.post("/:productId/favorite", auth.verifyAccessToken, likeProduct);
productRouter.delete(
  "/:productId/favorite",
  auth.verifyAccessToken,
  unlikeProduct
);
productRouter.use("/:productId/comments", commentRouter);

export default productRouter;
