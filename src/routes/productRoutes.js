import express from "express";
import requiredDataValidate from "../middlewares/requiredDataValidate.js";
import productController from "../controllers/productController.js";
import multer from "multer";

const productRouter = express.Router();

// 이미지 업로드
const upload = multer({ dest: "uploads/" });

// 상품 목록 불러오기
productRouter.get("/", productController.getProducts);

// 상품 상세조회
productRouter.get("/:productId", productController.getProduct);

// 상품 등록
productRouter.post(
  "/",
  upload.array("imageFiles", 3),
  requiredDataValidate,
  productController.createProduct
);

// 상품 수정
productRouter.patch("/:productId", productController.updateProduct);

// 상품 삭제
productRouter.delete("/:productId", productController.deleteProduct);

// 상품 좋아요
productRouter.post("/:productId/like", productController.addlikeProduct);

// 상품 좋아요 취소
productRouter.delete("/:productId/like", productController.cancelLikeProduct);

export default productRouter;
