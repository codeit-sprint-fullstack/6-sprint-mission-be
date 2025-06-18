import { User } from "@prisma/client";
import authRepository from "../repositories/authRepository";
import jwt from "jsonwebtoken";
import { CreateUserDto, CreateUserSchema, EmailSchema } from "../dto/auth.dto";
import { ValidationError } from "../types/errors";

async function create(user: CreateUserDto) {
  const parsed = CreateUserSchema.safeParse(user);
  if (!parsed.success) throw new ValidationError("형식이 유효하지 않습니다.");

  return await authRepository.save(parsed.data);
}

function createAccessToken(user: User["id"]) {
  const secretKey = `${process.env.JWT_SECRET_KEY}`;
  const payload = { userId: user };

  return jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });
}

function createRefreshToken(user: User["id"]) {
  const secretKey = `${process.env.JWT_REFRESH_SECRET_KEY}`;
  const payload = { userId: user };

  return jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });
}

async function getByEmail(email: User["email"]) {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) throw new ValidationError("잘못된 이메일 형식입니다.");

  return await authRepository.findByEmail(parsed.data);
}

export default {
  create,
  createAccessToken,
  createRefreshToken,
  getByEmail,
};
