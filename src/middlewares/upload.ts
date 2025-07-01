import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET as string,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    cb(null, `images/${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.') as any, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload; 