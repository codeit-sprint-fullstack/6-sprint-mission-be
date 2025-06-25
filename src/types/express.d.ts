import { User as PrismaUser } from "@prisma/client";
import { File as MulterFile } from "multer";

declare global {
  namespace Express {
    export interface Request {
      auth: {
        userId: number;
      };
      files?: MulterFile[];
    }
  }
}

export {};
