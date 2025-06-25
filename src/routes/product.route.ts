import express, { Router, RequestHandler } from "express";
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

const router: Router = express.Router();
const upload = multer();

// 전체 상품 목록 조회
router.get("/", getAllProducts as unknown as RequestHandler);

// 상품 상세 조회
router.get("/:productId", optionalVerifyToken as unknown as RequestHandler, getProductById as unknown as RequestHandler);

// 댓글 조회
router.get("/:productId/comments", getProductComments as unknown as RequestHandler);

// 상품 등록
router.post("/", verifyToken as unknown as RequestHandler, upload.none(), createProduct as unknown as RequestHandler);

// 상품 수정
router.patch("/:productId", verifyToken as unknown as RequestHandler, updateProduct as unknown as RequestHandler);

// 상품 삭제
router.delete("/:productId", verifyToken as unknown as RequestHandler, deleteProduct as unknown as RequestHandler);

// 상품 좋아요
router.post("/:productId/favorite", verifyToken as unknown as RequestHandler, likeProduct as unknown as RequestHandler);

// 좋아요 취소
router.delete("/:productId/favorite", verifyToken as unknown as RequestHandler, unlikeProduct as unknown as RequestHandler);

export default router; 