import userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import {
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
} from "../utils/authUtils.js";
import { BadRequestError, UnauthorizedError } from "../exceptions.js";

/**
 * 유저 생성 함수
 */
async function createUser(user) {
  try {
    const existingEmail = await userRepository.findByEmail(user.email);
    if (existingEmail) {
      throw new BadRequestError("이미 사용중인 이메일입니다.", {
        email: { message: "이미 사용중인 이메일입니다." },
      });
    }
    const existingNickname = await userRepository.findByNickname(user.nickname);
    if (existingNickname) {
      throw new BadRequestError("이미 사용중인 닉네임입니다.", {
        nickname: { message: "이미 사용중인 닉네임입니다." },
      });
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
 * 유저 정보 가져오는 함수
 */
async function getUser(email, password) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError("존재하지 않는 이메일입니다.", {
        email: { message: "존재하지 않는 이메일입니다." },
      });
    }
    const isMatch = await verifyPassword(password, user.hashedPassword);
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

/**
 * id로 유저 정보 가져오는 함수
 */
async function getUserById(userId) {
  const user = await userRepository.findById(userId);
  return filterSensitiveUserData(user);
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
    throw new UnauthorizedError();
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { newAccessToken, newRefreshToken };
}

async function oauthUser(provider, providerId, email, name) {
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
  createToken,
  refreshToken,
  oauthUser,
};
