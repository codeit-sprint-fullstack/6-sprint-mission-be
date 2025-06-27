import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/auth.repository";

export const signUp = async (
  email: string,
  nickname: string,
  password: string
): Promise<{ id: number }> => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, nickname, hashedPassword);
  return { id: user.id };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ accessToken: string; nickname: string }> => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("INVALID");
  }

  const isMatch = await bcrypt.compare(password, user.encryptedPassword);
  if (!isMatch) {
    throw new Error("INVALID");
  }

  const accessToken = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });

  return {
    accessToken,
    nickname: user.nickname,
  };
};
