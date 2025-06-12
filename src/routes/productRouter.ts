import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  likeProduct,
  unlikeProduct,
  updateProduct,
} from "../controllers/productController";
import auth from "../middlewares/auth";
import { productValidator } from "../middlewares/validator";
import commentRouter from "./commentRouter";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post(
  "/",
  auth.verifyAccessToken,
  productValidator,
  createProduct
);
productRouter.get("/:productId", auth.verifyAccessToken, getProduct);
productRouter.patch(
  "/:productId",
  auth.verifyAccessToken,
  productValidator,
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
