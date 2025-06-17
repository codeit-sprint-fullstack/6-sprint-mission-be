import express from 'express';
import authRouter from './auth.router';
import articleRouter from './article.router';
import productRouter from './product.router';
import commentRouter from './comment.router';
import likeRouter from './like.router';
import uploadRouter from './upload.router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/articles', articleRouter);
router.use('/products', productRouter);
router.use('/comments', commentRouter);
router.use('/like', likeRouter);
router.use('/upload', uploadRouter);

export default router; 