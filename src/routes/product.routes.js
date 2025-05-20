import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  getBestProducts,
} from "../controllers/productController.js";
import {
  createComment,
  getProductComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  validateProductInputs,
  validateProductImages,
} from "../middlewares/productValidation.js";

const router = express.Router();

// 베스트 상품 라우트 (일반 상품 목록 라우트보다 위에 배치)
router.get("/best", getBestProducts);
// 루트 경로 통합
router
  .route("/")
  .get(verifyAccessToken, getAllProducts)
  .post(
    verifyAccessToken,
    upload.array("images", 3),
    validateProductInputs,
    validateProductImages,
    createProduct
  );
// 상품 ID 기반 라우트 통합
router
  .route("/:id")
  .get(getProductById)
  .patch(verifyAccessToken, upload.array("images", 3), updateProduct)
  .delete(verifyAccessToken, deleteProduct);
// 좋아요 관련 라우트 통합
router
  .route("/:id/favorite")
  .post(verifyAccessToken, likeProduct)
  .delete(verifyAccessToken, unlikeProduct);
// 댓글 관련 라우트 통합
router
  .route("/:id/comments")
  .get(getProductComments)
  .post(verifyAccessToken, createComment);
// 댓글 ID 기반 라우트 통합
router
  .route("/:id/comments/:commentId")
  .patch(verifyAccessToken, updateComment)
  .delete(verifyAccessToken, deleteComment);

export default router;
