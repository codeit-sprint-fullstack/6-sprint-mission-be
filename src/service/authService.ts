import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SLIDING_THRESHOLD_SEC,
} from "../constants/tokenTTL";
import {
  AuthenticationError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/commonError";
import { UserDto, UserParamsDto } from "../dtos/user.dto";

// 비밀번호 검증 함수
async function verifyPassword(inputPassword: string, storedPassword: string) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);

    if (!isMatch) {
      const error = new AuthenticationError("비밀번호가 일치하지 않습니다.");
      throw error;
    }
  } catch (err) {
    console.error("❌ bcrypt 에러:", err);
    throw err;
  }
}

// 민감한 정보 필터링
function filterSensitiveUserData(user: UserDto) {
  const { encryptedPassword, refreshToken, ...rest } = user;
  return rest;
}

// 로그인
async function signIn(email: string, password: string) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new AuthenticationError("존재하지 않는 이메일입니다.");
      throw error;
    }

    await verifyPassword(password, user.encryptedPassword);
    return filterSensitiveUserData(user);
  } catch (error) {
    console.error("❌ signIn 내부 실제 에러:", error);
    if (error instanceof AuthenticationError) throw error;

    const customError = new ServerError("로그인 처리 중 오류가 발생했습니다");
    throw customError;
  }
}

// 토큰 생성
// type에 따라 access, refresh 토큰 발급
function createToken(userId: string, type: "access" | "refresh") {
  const payload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: type === "refresh" ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL,
  });
  return token;
}

// 토큰 재발급 (Sliding Session)
async function refreshUserToken(userId: string, currentRefreshToken?: string) {
  const user = await userRepository.findById(userId);

  if (!user || user.refreshToken !== currentRefreshToken) {
    const error = new AuthenticationError("토큰 인증 실패");
    throw error;
  }

  // 현재 리프레시 토큰의 잔여시간 계산
  const decoded = jwt.verify(currentRefreshToken, process.env.JWT_SECRET!) as {
    exp: number;
  };
  const now = Date.now() / 1000;
  const timeLeft = decoded.exp - now;

  const accessToken = createToken(userId, "access");
  let newRefreshToken = undefined;

  // refreshToken의 남은 시간이 SLIDING_THRESHOLD_SEC 이하면 슬라이딩 갱신
  if (timeLeft < SLIDING_THRESHOLD_SEC) {
    newRefreshToken = createToken(userId, "refresh");
    await userRepository.update(userId, {
      refreshToken: newRefreshToken,
    });
  }

  return { accessToken, newRefreshToken };
}

// 비밀번호 변경
async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error = new NotFoundError("사용자를 찾을 수 없습니다.");
      throw error;
    }

    if (!currentPassword || !newPassword) {
      const error = new ValidationError(
        "현재 비밀번호와 새 비밀번호가 모두 필요합니다."
      );
      throw error;
    }

    // 현재 비밀번호 검증
    await verifyPassword(currentPassword, user.encryptedPassword);

    // 새 비밀번호 해싱
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await userRepository.update(userId, {
      encryptedPassword: hashedNewPassword,
    });

    return true;
  } catch (error) {
    if (error instanceof ServerError) throw error;

    const customError = new ServerError(
      "비밀번호 변경 중 오류가 발생했습니다."
    );
    throw customError;
  }
}

// 로그아웃
async function logout(userId: UserParamsDto["id"]) {
  try {
    // 사용자의 refreshToken을 null로 업데이트
    await userRepository.update(userId, { refreshToken: undefined });
    return true;
  } catch (error) {
    console.error("❌ 로그아웃 중 오류 발생:", error);
    const customError = new ServerError("로그아웃 처리 중 오류가 발생했습니다");
    throw customError;
  }
}

export default {
  signIn,
  createToken,
  refreshUserToken,
  changePassword,
  verifyPassword,
  filterSensitiveUserData,
  logout,
};
