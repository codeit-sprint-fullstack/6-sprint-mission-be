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
import { createProductValidator, validator } from "../middlewares/validator.js";
import commentRouter from "./commentRouter.js";

const productRouter = express.Router();

productRouter.get("/", auth.verifyAccessToken, getProducts);
productRouter.post(
  "/",
  auth.verifyAccessToken,
  createProductValidator,
  validator,
  createProduct
);
productRouter.get("/:productId", auth.verifyAccessToken, getProduct);
productRouter.patch("/:productId", auth.verifyAccessToken, updateProduct);
productRouter.delete("/:productId", auth.verifyAccessToken, deleteProduct);
productRouter.post("/:productId/favorite", auth.verifyAccessToken, likeProduct);
productRouter.delete(
  "/:productId/favorite",
  auth.verifyAccessToken,
  unlikeProduct
);
productRouter.use("/:productId/comments", commentRouter);

export default productRouter;
