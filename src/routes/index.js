import express from 'express';
import authRouter from './authRouter.js';
import articleRouter from './articleRouter.js';
import productRouter from './productRouter.js';
import commentRouter from './commentRouter.js';
import likeRouter from './likeRouter.js';
import uploadRouter from './uploadRouter.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/article', articleRouter);
router.use('/product', productRouter);
router.use('/comment', commentRouter);
router.use('/like', likeRouter);
router.use('/upload', uploadRouter);


export default router;