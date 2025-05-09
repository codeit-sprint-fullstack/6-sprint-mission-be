import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * 유저 생성 함수
 */
async function createUser(user) {
  try {
    const existingEmail = await userRepository.findByEmail(user.email);
    if (existingEmail) {
      const error = new Error("이미 사용중인 이메일입니다.");
      error.code = 400;
      error.data = { email: { message: error.message } };
      throw error;
    }
    const existingNickname = await userRepository.findByNickname(user.nickname);
    if (existingNickname) {
      const error = new Error("이미 사용중인 닉네임입니다.");
      error.code = 400;
      error.data = { nickname: { message: error.message } };
      throw error;
    }
    const hashedPassword = await hashPassword(user.password);
    const createdUser = await userRepository.save(user, hashedPassword);
    return filterSensitiveUserData(createdUser);
  } catch (error) {
    console.error("createUser Error");
    throw error;
  }
}

/**
 * 비밀번호 해싱 함수
 */
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * 민감한 정보 필터링 함수
 */
function filterSensitiveUserData(user) {
  const { hashedPassword, refreshToken, ...rest } = user;
  return rest;
}

/**
 * 유저 정보 가져오는 함수
 */
async function getUser(email, password) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다.");
      error.code = 401;
      throw error;
    }
    await verifyPassword(password, user.hashedPassword);
    return filterSensitiveUserData(user);
  } catch (error) {
    console.error("getUser Error");
    throw error;
  }
}

/**
 * 비밀번호 검증 함수
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
 * 유저 정보 업데이트 함수
 */
async function updateUser(id, data) {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

/**
 * 토큰 생성 함수
 */
function createToken(user, type = "access") {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

/**
 * 토큰 갱신 함수
 */
async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { newAccessToken, newRefreshToken };
}

export default {
  createUser,
  getUser,
  createToken,
  updateUser,
  refreshToken,
};
