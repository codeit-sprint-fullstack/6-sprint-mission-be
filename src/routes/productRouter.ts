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
import { productValidator, validator } from "../middlewares/validator";
import commentRouter from "./commentRouter";
import { verifyAccessToken } from "../middlewares/verifyToken";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post(
  "/",
  verifyAccessToken,
  productValidator,
  validator,
  createProduct
);
productRouter.get("/:productId", verifyAccessToken, getProduct);
productRouter.patch(
  "/:productId",
  verifyAccessToken,
  productValidator,
  validator,
  updateProduct
);
productRouter.delete("/:productId", verifyAccessToken, deleteProduct);
productRouter.post("/:productId/favorite", verifyAccessToken, likeProduct);
productRouter.delete("/:productId/favorite", verifyAccessToken, unlikeProduct);
productRouter.use("/:productId/comments", commentRouter);

export default productRouter;
