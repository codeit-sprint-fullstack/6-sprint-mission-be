import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository";
import authService from "./authService";
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../types/commonError";
import { UserParamsDto, UserSignUpDto, UserUpdateDto } from "../dtos/user.dto";

// 패스워드 암호화
function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// 회원가입
async function createUser(user: UserSignUpDto) {
  try {
    // 중복 유저 체크
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new ValidationError("User already exists", {
        email: user.email,
      });
      throw error;
    }

    const hashedPassword = await hashPassword(user.password);
    const createdUser = await userRepository.save({
      nickname: user.nickname,
      email: user.email,
      encryptedPassword: hashedPassword,
    });

    return authService.filterSensitiveUserData(createdUser);
  } catch (error) {
    console.error("🔥 실제 Prisma 에러:", error);
    if (error instanceof ValidationError) throw error;

    // Prisma 에러를 애플리케이션에 맞는 형식으로 변환
    const customError = new DatabaseError(
      "데이터베이스 작업 중 오류가 발생했습니다"
    );
    throw customError;
  }
}

// 유저 id로 조회
async function getUserById(id: UserParamsDto["id"]) {
  const user = await userRepository.findById(id);

  if (!user) {
    const error = new NotFoundError("Not Found");
    throw error;
  }

  return authService.filterSensitiveUserData(user);
}

// 유저 정보 업데이트
async function updateUser(
  id: UserParamsDto["id"],
  data: Partial<UserUpdateDto>
) {
  const updatedUser = await userRepository.update(id, data);
  return authService.filterSensitiveUserData(updatedUser);
}

export default {
  createUser,
  getUserById,
  updateUser,
  hashPassword,
};
