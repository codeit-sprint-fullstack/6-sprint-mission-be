declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
      files?: Express.Multer.File[];
      file?: Express.Multer.File;
    }
  }
}
export {};
