import express from 'express';
import upload from '../middlewares/upload';
import uploadController from '../controllers/upload.controller';
import { wrapAsync } from '../utils/wrapAsync';
    
const uploadRouter = express.Router();

// 단일 이미지 업로드
uploadRouter.post('/image', upload.single('image'), wrapAsync(uploadController.uploadSingleImage));

// 여러 이미지 업로드 (최대 3개)
uploadRouter.post('/images', upload.array('images', 3), wrapAsync(uploadController.uploadMultipleImages));

export default uploadRouter; 