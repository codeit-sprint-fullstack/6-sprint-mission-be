import express from 'express';
import {
  getMe,
  updateMe,
  updatePassword,
  getMyProducts,
  getMyFavorites,
} from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.patch('/me/password', authMiddleware, updatePassword);
router.get('/me/products', authMiddleware, getMyProducts);
router.get('/me/favorites', authMiddleware, getMyFavorites);

export default router;