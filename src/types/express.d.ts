import { User as PrismaUser } from "@prisma/client";
import { Request } from "express"; // 이 줄은 있어도 되고 없어도 되지만, 명확성을 위해 두는 것을 권장합니다.

declare global {
  namespace Express {
    export interface Request {
      auth?: {
        id: number;
        email?: string;
        name?: string;
        // 필요한 경우 다른 속성도 추가 (예: role?: string;)
      };
      user?: PrismaUser; // passport가 추가하는 user 속성
      cookies: {
        refreshToken?: string;
      };
    }
  }
}

export {};
