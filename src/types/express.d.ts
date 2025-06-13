import { Express, Request } from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
      files: Express.Multer.File[];
    }
  }
}

export {}; // ✅ 글로벌 선언을 모듈로 만들어 TypeScript가 인식하게 함
