import express from "express";
import requiredDataValidate from "../middlewares/requiredDataValidate.js";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

// 상품 목록 불러오기
productRouter.get("/", productController.getProducts);

// 상품 상세조회
productRouter.get("/:productId", productController.getProduct);

// 상품 등록
productRouter.post("/", requiredDataValidate, productController.createProduct);

// 상품 수정
productRouter.patch("/:productId", productController.updateProduct);

// 상품 삭제
productRouter.delete("/:productId", productController.deleteProduct);

// 상품 좋아요

// 상품 좋아요 취소

export default productRouter;
