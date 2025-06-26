import { Express, Request } from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
      files: Express.Multer.File[];
    }

    // S3용 multer 파일 타입 정의
    interface MulterS3 {
      File: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        bucket: string;
        key: string;
        acl: string;
        contentType: string;
        contentDisposition: string;
        storageClass: string;
        serverSideEncryption: string;
        metadata: any;
        location: string; // S3 URL
        etag: string;
      };
    }
  }
}

// S3 이미지 관련 타입 정의
export interface S3ImageInfo {
  originalUrl: string;
  presignedUrl?: string;
  isPrivate: boolean;
  key: string;
}

export interface ImageProcessOptions {
  generatePresignedUrl?: boolean;
  expiresIn?: number; // presigned URL 만료 시간 (초)
}

export interface ProcessedImage {
  url: string;
  isPresigned: boolean;
}

export {}; // ✅ 글로벌 선언을 모듈로 만들어 TypeScript가 인식하게 함
