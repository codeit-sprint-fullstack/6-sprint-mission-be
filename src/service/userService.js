import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository.js";
import authService from "./authService.js";

// 패스워드 암호화
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// 회원가입
async function createUser(user) {
  try {
    // 중복 유저 체크
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
      encryptedPassword: hashedPassword,
    });

    return authService.filterSensitiveUserData(createdUser);
  } catch (error) {
    console.error("🔥 실제 Prisma 에러:", error);
    if (error.code === 422) throw error;

    // Prisma 에러를 애플리케이션에 맞는 형식으로 변환
    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

// 유저 id로 조회
async function getUserById(id) {
  const user = await userRepository.findById(id);

  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }

  return authService.filterSensitiveUserData(user);
}

// 유저 정보 업데이트
async function updateUser(id, data) {
  const updatedUser = await userRepository.update(id, data);
  return authService.filterSensitiveUserData(updatedUser);
}

export default {
  createUser,
  getUserById,
  updateUser,
  hashPassword,
};
