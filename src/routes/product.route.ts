import express from "express";
import verifyToken from "../middlewares/verifyToken";
import upload from "../middlewares/multer";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  verifyToken,
  upload.single("image"),
  createProductController
);

productRouter.get("/", getAllProductsController);
productRouter.get("/:id", getProductByIdController);
productRouter.patch("/:id", verifyToken, updateProductController);
productRouter.delete("/:id", verifyToken, deleteProductController);

export default productRouter;
