import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
  addToFavorites,
  removeFromFavorites,
} from '../controllers/product.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.put('/:productId', authMiddleware, updateProduct);
router.delete('/:productId', authMiddleware, deleteProductById);
router.post('/:productId/favorite', authMiddleware, addToFavorites);
router.delete('/:productId/favorite', authMiddleware, removeFromFavorites);

export default router;