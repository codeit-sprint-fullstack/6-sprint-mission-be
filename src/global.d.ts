// global.d.ts
import "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number; // 또는 string, 실제 JWT에 담긴 타입
        email?: string;
      };
    }
  }
}
