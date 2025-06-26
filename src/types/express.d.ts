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

export {}; // ✅ 글로벌 선언을 모듈로 만들어 TypeScript가 인식하게 함
