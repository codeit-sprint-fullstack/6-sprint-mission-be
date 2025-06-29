import express from "express";
import commentRouter from "./comment.router";
import { productValidator, validator } from "../middlewares/validator";
import { verifyAccessToken } from "../middlewares/verifyToken";
import {
  deleteProductController,
  getProductController,
  getProductsController,
  likeProductController,
  unlikeProductController,
  updateProductController,
} from "../controllers/product.controller";

const productRouter = express.Router();

productRouter.get("/", getProductsController);
productRouter.post("/", verifyAccessToken, productValidator, validator);
productRouter.get("/:productId", verifyAccessToken, getProductController);
productRouter.patch(
  "/:productId",
  verifyAccessToken,
  productValidator,
  validator,
  updateProductController
);
productRouter.delete("/:productId", verifyAccessToken, deleteProductController);
productRouter.post(
  "/:productId/favorite",
  verifyAccessToken,
  likeProductController
);
productRouter.delete(
  "/:productId/favorite",
  verifyAccessToken,
  unlikeProductController
);
productRouter.use("/:productId/comments", commentRouter);

export default productRouter;
