import express from 'express';
import productController from '../controllers/product.controller';
import auth from '../middlewares/auth';
import { wrapAsync } from '../utils/wrapAsync';

const productRouter = express.Router();

// 상품 생성
productRouter.post('/', auth.verifyAccessToken, wrapAsync(productController.createProduct));

// 상품 목록 조회
productRouter.get('/', wrapAsync(productController.getProducts));

// 상품 상세 조회
productRouter.get('/:productId', wrapAsync(productController.getProductById));

// 상품 수정
productRouter.patch('/:productId', auth.verifyAccessToken, wrapAsync(productController.updateProduct));

// 상품 삭제
productRouter.delete('/:productId', auth.verifyAccessToken, wrapAsync(productController.deleteProduct));

export default productRouter; 