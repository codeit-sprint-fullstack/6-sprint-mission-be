import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";

// 토큰에 포함될 payload 타입 정의
interface TokenPayload {
  id: number;
  email: string;
}

export function generateToken(user: User): string {
  const payload: TokenPayload = { id: user.id, email: user.email };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "7d",
  });
} 