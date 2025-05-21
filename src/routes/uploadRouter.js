import express from 'express';
import upload from '../middlewares/upload.js';
import uploadController from '../controllers/uploadController.js';

const uploadRouter = express.Router();

// 단일 이미지 업로드
uploadRouter.post('/image', upload.single('image'), uploadController.uploadSingleImage);

// 여러 이미지 업로드 (최대 3개)
uploadRouter.post('/images', upload.array('images', 3), uploadController.uploadMultipleImages);

export default uploadRouter;