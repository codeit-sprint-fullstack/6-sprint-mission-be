import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
  };
}

// Express 미들웨어 타입
export type RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;

// JWT 관련 타입
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 

