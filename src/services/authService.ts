import { User } from "@prisma/client";
import authRepository from "../repositories/authRepository";
import jwt from "jsonwebtoken";

async function create(user: User) {
  return await authRepository.save(user);
}

function createAccessToken(user: User) {
  const secretKey = `${process.env.JWT_SECRET_KEY}`;

  const payload = { userId: user.id };
  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });
  return accessToken;
}

function createRefreshToken(user: User) {
  const secretKey = `${process.env.JWT_REFRESH_SECRET_KEY}`;

  const payload = { userId: user.id };
  const refreshToken = jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });
  return refreshToken;
}

async function getByEmail(user: User) {
  return await authRepository.findByEmail(user);
}

export default {
  create,
  createAccessToken,
  createRefreshToken,
  getByEmail,
};
