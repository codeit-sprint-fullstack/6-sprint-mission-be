import express from 'express';
import productController from '../controllers/productController.js';
import auth from '../middlewares/auth.js';

const productRouter = express.Router();

// 상품 생성 (인증 필요)
productRouter.post('/', auth.verifyAccessToken, productController.createProduct);

// 모든 상품 조회
productRouter.get('/', productController.getProducts);

// 특정 상품 조회
productRouter.get('/:productId', productController.getProductById);

// 상품 수정 (인증 필요)
productRouter.put('/:productId', auth.verifyAccessToken, productController.updateProduct);

// 상품 삭제 (인증 필요)
productRouter.delete('/:productId', auth.verifyAccessToken, productController.deleteProduct);

export default productRouter;