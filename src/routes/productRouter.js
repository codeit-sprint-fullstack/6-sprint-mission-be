import express from 'express';
import * as productController from '../controllers/productController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 상품 목록 조회 (비인증)
router.get('/', errorHandler(productController.getProducts));

// 상품 단건 조회 (비인증)
router.get('/:productId', errorHandler(productController.getProduct));

// 상품 생성 (인증 필요)
router.post('/', authMiddleware, errorHandler(productController.createProduct));

// 상품 수정 (인증 필요)
router.patch('/:productId', authMiddleware, errorHandler(productController.updateProduct));

// 상품 삭제 (인증 필요)
router.delete('/:productId', authMiddleware, errorHandler(productController.deleteProduct));

// 좋아요 추가 (인증 필요)
router.post('/:productId/like', authMiddleware, errorHandler(productController.likeProduct));

// 좋아요 제거 (인증 필요)
router.delete('/:productId/like', authMiddleware, errorHandler(productController.unlikeProduct));

export default router;
