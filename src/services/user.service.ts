import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository";
import { AuthenticationError, BadRequestError } from "../types/errors";
import prisma from "../config/client.prisma";
import { User } from "@prisma/client";
import { createToken } from "../utils/token.util";
import { filterPassword } from "../utils/user.util";

type TAuth = Promise<{
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

// 회원가입
const signUp = async (
  body: Pick<User, "email" | "password" | "nickname">
): TAuth => {
  const { email, password, nickname } = body;

  // 유효성 검사
  if (!email || !password || !nickname)
    throw new BadRequestError("이메일, 비밀번호, 닉네임을 모두 입력해주세요.");

  const existedEmail = await userRepository.findByEmail(email);

  // 존재하는 이메일
  if (existedEmail) throw new BadRequestError("이미 존재하는 이메일입니다.");

  const existedNickname = await userRepository.findByNickname(nickname);

  // 존재하는 닉네임
  if (existedNickname) throw new BadRequestError("이미 존재하는 닉네임입니다.");

  return await prisma.$transaction(async (tx) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser(
      {
        email,
        password: encryptedPassword,
        nickname,
      },
      { tx }
    );

    const filterPasswordUser = filterPassword(newUser);
    const accessToken = createToken(newUser);
    const refreshToken = createToken(newUser, "refreshToken");

    return { ...filterPasswordUser, accessToken, refreshToken };
  });
};

// 로그인
const login = async (body: Pick<User, "email" | "password">): TAuth => {
  const { email, password } = body;

  const existedUser = await userRepository.findByEmail(email);

  // 이메일 불일치
  if (!existedUser) throw new BadRequestError("존재하지 않는 이메일입니다.");

  // 비밀번호 불일치
  const verifyPassword = await bcrypt.compare(password, existedUser.password);

  if (!verifyPassword)
    throw new BadRequestError("비밀번호가 일치하지 않습니다.");

  const filterPasswordUser = filterPassword(existedUser);
  const accessToken = createToken(existedUser);
  const refreshToken = createToken(existedUser, "refreshToken");

  return { ...filterPasswordUser, accessToken, refreshToken };
};

// 내 정보 불러오기
const getMe = async (userId: User["id"]) => {
  const user = await userRepository.findById(userId);

  return user;
};

// 액세스 토큰 재발급
const refreshAccessToken = async (userId: User["id"]) => {
  const user = await userRepository.findById(userId);

  if (!user) throw new AuthenticationError("인증에 실패하였습니다.");

  const accessToken = createToken(user);
  const refreshToken = createToken(user, "refreshToken");

  return { accessToken, refreshToken };
};

export default {
  signUp,
  login,
  getMe,
  refreshAccessToken,
};
