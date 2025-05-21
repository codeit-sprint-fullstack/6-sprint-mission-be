import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * 비밀번호 해싱
 */
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * 민감한 유저 정보 제거
 */
function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

/**
 * 비밀번호 검증
 */
async function verifyPassword(inputPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
}

/**
 * 유저 확인
 */
async function getMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

/**
 * 회원가입
 */
async function createUser(user) {
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new Error("이미 존재하는 이메일입니다.");
      error.code = 422;
      error.data = { email: user.email };
      throw error;
    }

    const hashedPassword = await hashPassword(user.password);
    const createdUser = await userRepository.createdUser({
      ...user,
      password: hashedPassword,
    });

    return filterSensitiveUserData(createdUser);
  } catch (error) {
    if (error.code === 422) throw error;

    const customError = new Error("회원가입 처리 중 오류가 발생했습니다.");
    customError.code = 500;
    throw customError;
  }
}

/**
 * 로그인
 */
async function getUser(email, password) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다.");
      error.code = 401;
      throw error;
    }

    await verifyPassword(password, user.password);
    return { ...filterSensitiveUserData(user), id: user.id };
  } catch (error) {
    if (error.code === 401) throw error;

    const customError = new Error("로그인 처리 중 오류가 발생했습니다.");
    customError.code = 500;
    throw customError;
  }
}

/**
 * JWT 토큰 생성
 */
function createToken(user, type = "access") {
  const payload = { userId: user.id };
  const expiresIn = type === "refresh" ? "14d" : "1h";

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * 사용자 정보 업데이트
 */
async function updateUser(id, data) {
  const updatedUser = await userRepository.updateUser(id, data);
  return filterSensitiveUserData(updatedUser);
}

/**
 * 리프레시 토큰 검증 및 재발급
 */
async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("인증되지 않았습니다.");
    error.code = 401;
    throw error;
  }

  const newAccessToken = createToken(user, "access");
  const newRefreshToken = createToken(user, "refresh");

  return { newAccessToken, newRefreshToken };
}

export default {
  createUser,
  getUser,
  getMe,
  createToken,
  updateUser,
  refreshToken,
};
