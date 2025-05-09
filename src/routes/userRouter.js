import express from 'express';
import * as userController from '../controllers/userController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, errorHandler(userController.getMe));
router.patch('/me', authMiddleware, errorHandler(userController.updateMe));
router.patch('/me/password', authMiddleware, errorHandler(userController.updateMyPassword));
router.get('/me/products', authMiddleware, errorHandler(userController.getMyProduct));
router.get('/me/favorites', authMiddleware, errorHandler(userController.getMyFavorites));

export default router;
