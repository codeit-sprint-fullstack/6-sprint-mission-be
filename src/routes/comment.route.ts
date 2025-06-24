import express from 'express';
import {
  createProductComment,
  getProductComments,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/products/:productId/comments', authMiddleware, createProductComment);
router.get('/products/:productId/comments', getProductComments);

router.patch('/comments/:commentId', authMiddleware, updateComment);
router.delete('/comments/:commentId', authMiddleware, deleteComment);

export default router;