import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  getProductComments,
} from "../controllers/product.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { optionalVerifyToken } from "../middlewares/optionalAuth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer(); // memory storage by default

// 전체 상품 목록 조회
router.get("/", getAllProducts);

// 상품 상세 조회 - 로그인 X 가능 (선택적 인증)
router.get("/:productId", optionalVerifyToken, getProductById);

// 댓글 조회
router.get("/:productId/comments", getProductComments);

// 상품 등록
router.post("/", verifyToken, upload.none(), createProduct);

// 상품 수정
router.patch("/:productId", verifyToken, updateProduct);

// 상품 삭제
router.delete("/:productId", verifyToken, deleteProduct);

// 상품 좋아요
router.post("/:productId/favorite", verifyToken, likeProduct);

// 좋아요 취소
router.delete("/:productId/favorite", verifyToken, unlikeProduct);

export default router;
