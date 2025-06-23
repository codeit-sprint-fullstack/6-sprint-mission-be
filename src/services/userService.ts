import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AuthenticationError,
  ServerError,
  ValidationError,
} from "../types/error";
type UserInput = {
  email: string;
  encryptedPassword: string;
  username?: string;
};
type UserCredentials = {
  email: string;
  inputPassword: string;
};

function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new AuthenticationError("Can not find password");
  }
  return bcrypt.hash(password, 10);
}
function filterSensitiveUserData(user: User) {
  const { encryptedPassword, ...rest } = user;
  return rest;
}
async function createUser(user: UserInput) {
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      throw new ValidationError("User already exists");
    }

    const hashedPassword = await hashPassword(user.encryptedPassword);
    const createdUser = await userRepository.save({
      ...user,
      encryptedPassword: hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
  } catch (error) {
    throw new ServerError("Error while db process");
  }
}

async function verifyPassword(
  inputPassword: string,
  dbPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(inputPassword, dbPassword);
  if (!isMatch) {
    throw new AuthenticationError("Failed to authenticate");
  }
  return true;
}
function createToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const payload = { userId: user.id };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}
async function getUser({ email, inputPassword }: UserCredentials) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Failed to authenticate");
    }

    await verifyPassword(inputPassword, user.encryptedPassword);
    return filterSensitiveUserData(user);
  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
  }
  throw new ServerError("Error while db process");
}

export default {
  createUser,
  getUser,
  createToken,
};
