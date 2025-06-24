import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
// 이미지 업로드 관련 서비스 (예: AWS S3, 로컬 저장소) import
// import imageService from '../services/image.service';

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  // 이미지 업로드 로직 구현 (multer 등의 미들웨어 필요할 수 있음)
  // const imageUrl = await imageService.upload(req.file);
  res.send({ imageUrl: '임시 이미지 URL' }); // 실제 구현 필요
});