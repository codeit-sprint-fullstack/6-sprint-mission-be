import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: number;
}

const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: '토큰이 없습니다.' });
    return; 
  }

  jwt.verify(token, 'SECRET_KEY', (err, decoded: any) => {
    if (err) {
      res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    // 타입 확장 필요 시 (다운캐스팅)
    (req as AuthRequest).userId = decoded.id;
    next();
  });
};

export default verifyToken;
