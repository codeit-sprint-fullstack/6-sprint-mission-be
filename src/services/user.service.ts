import userRepository from "../repositories/user.repository";
import {
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
} from "../utils/auth.utils";
import { BadRequestError } from "../types/exceptions";
import { User } from "@prisma/client";

// 유저 생성 함수
async function createUser(email: string, nickname: string, password: string) {
  try {
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new BadRequestError("이미 사용중인 이메일입니다.", {
        email: { message: "이미 사용중인 이메일입니다." },
      });
    }
    const existingNickname = await userRepository.findByNickname(nickname);
    if (existingNickname) {
      throw new BadRequestError("이미 사용중인 닉네임입니다.", {
        nickname: { message: "이미 사용중인 닉네임입니다." },
      });
    }
    const hashedPassword = await hashPassword(password);
    const createdUser = await userRepository.save({
      email,
      nickname,
      hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
  } catch (error) {
    console.error("createUser Error");
    throw error;
  }
}

// 유저 정보 가져오는 함수
async function getUser(email: User["email"], password: string) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError("존재하지 않는 이메일입니다.", {
        email: { message: "존재하지 않는 이메일입니다." },
      });
    }
    const isMatch = await verifyPassword(password, user.hashedPassword!);
    if (!isMatch) {
      throw new BadRequestError("비밀번호가 일치하지 않습니다.", {
        password: { message: "비밀번호가 일치하지 않습니다." },
      });
    }
    return filterSensitiveUserData(user);
  } catch (error) {
    console.error("getUser Error");
    throw error;
  }
}

// id로 유저 정보 가져오는 함수
async function getUserById(userId: User["id"]) {
  const user = await userRepository.findById(userId);
  return filterSensitiveUserData(user!);
}

// 유저 정보 업데이트 함수
async function updateUser(
  id: User["id"],
  data: Partial<Pick<User, "nickname" | "hashedPassword" | "refreshToken">>
) {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

async function oauthUser(
  email: User["email"],
  name: User["nickname"],
  provider?: User["provider"],
  providerId?: User["providerId"]
) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const updatedUser = await userRepository.update(existingUser.id, {
      nickname: name,
      provider,
      providerId,
    });
    return filterSensitiveUserData(updatedUser);
  } else {
    const createdUser = await userRepository.save({
      email,
      nickname: name,
      provider,
      providerId,
    });
    return filterSensitiveUserData(createdUser);
  }
}

export default {
  createUser,
  getUser,
  getUserById,
  updateUser,
  oauthUser,
};
