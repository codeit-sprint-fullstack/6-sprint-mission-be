import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.js";
// import { User } from '../models/User.js';
import jwt from "jsonwebtoken";
// need to update value to ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET from .env
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const loginService = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.encryptedPassword);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }
  //  Generate a JWT token
  // need to update with access and refresh token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h", //  Set an appropriate expiration
  });

  //  Return the token and user data (excluding sensitive info)
  return {
    // update needed here
    token,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
    },
  };
};
