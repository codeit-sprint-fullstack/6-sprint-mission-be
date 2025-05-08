import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

// 비번 암호화 함수
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// 비번 제외 필터 함수
function filterSensitiveUserData(user) {
  const { password, ...rest } = user;
  return rest;
}

// 로그인 - 비번 일치 에러 함수
async function verifyPassword(inputPassword, password) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
}

/**
 * 계정 만들기 - 이메일 중복 여부, 비번 해싱 과정
 */
async function createdUser(user) {
  try {
    // 이메일을 통한 유저 존재여부
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new Error("User already exists");
      error.code = 422;
      error.data = { email: user.email };
      throw error;
    }

    const hashedPassword = await hashPassword(user.password);
    const createdUser = await userRepository.save({
      ...user,
      password: hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
  } catch (error) {
    if (error.code === 422) throw error; // 위의 중복 체크 에러는 별도로 전달

    const customError = new Error("올바른 값을 입력하십시오.");
    customError.code = 500;
    throw customError;
  }
}

/**
 * 로그인 - 이메일 존재 여부, 비번 일치 검사
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
    return filterSensitiveUserData(user);
  } catch (error) {
    if (error.code === 401) throw error;
    const customError = new Error("올바른 값을 입력하십시오.");
    customError.code = 500;
    throw customError;
  }
}

export default {
  createdUser,
  getUser,
};
