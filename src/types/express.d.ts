import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number;
        email: string;
        nickname: string;
      };
      user?: {
        id: number;
      };
      file?: Express.Multer.File;
      body?: {
        name: string;
        description: string;
        price: string | number;
        tags: string;
        content?: string;
      };
    }
  }
}

export {};
