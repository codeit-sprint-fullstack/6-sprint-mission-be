import express from 'express';
import { uploadImage } from '../controllers/image.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/upload', authMiddleware, uploadImage);

export default router;