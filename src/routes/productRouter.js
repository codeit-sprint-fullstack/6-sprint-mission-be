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
import { checkProductValidity, validate } from "../middlewares/validate.js";
// import commentRouter from "./commentRouter";

const productRouter = express.Router();

// productRouter.use("/:productId/comments", commentRouter);

productRouter.get("/", auth.verifyAccessToken, getProducts);
productRouter.post(
  "/",
  auth.verifyAccessToken,
  checkProductValidity,
  validate,
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

export default productRouter;
