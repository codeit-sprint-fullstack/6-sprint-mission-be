import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "1d";

export const signUpService = async function ({
  email,
  nickname,
  password,
  passwordConfirm,
}) {
  const existingUserByEmail = await userRepository.findByEmail(email);
  if (existingUserByEmail) {
    throw new Error("이미 존재하는 이메일 입니다.");
  }

  const existingUserByNickname = await userRepository.findByNickname(nickname);
  if (existingUserByNickname) {
    throw new Error("이미 존재하는 닉네임 입니다.");
  }

  if (password !== passwordConfirmation) {
    throw new Error("패스워드가 일치하지 않습니다");
  }
  // use hashed password to store it in the db User
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUserPayload = {
    email,
    nickname,
    encryptedPassword: hashedPassword,
  };

  const createdUser = await userRepository.create(newUserPayload);

  // generate tokens
  const accessToken = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
  return {
    user: createdUser,
    accessToken,
    refreshToken,
  };
};
