import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SLIDING_THRESHOLD_SEC,
} from "../constants/token.js";

// 비밀번호 검증 함수
async function verifyPassword(inputPassword, storedPassword) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    console.log("✅ bcrypt.compare 결과:", isMatch);

    if (!isMatch) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.code = 401;
      throw error;
    }
  } catch (err) {
    console.error("❌ bcrypt 에러:", err);
    throw err;
  }
}

// 민감한 정보 필터링
function filterSensitiveUserData(user) {
  const { encryptedPassword, refreshToken, ...rest } = user;
  return rest;
}

// 로그인
async function signIn(email, password) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다.");
      error.code = 401;
      throw error;
    }

    await verifyPassword(password, user.encryptedPassword);
    return filterSensitiveUserData(user);
  } catch (error) {
    console.error("❌ signIn 내부 실제 에러:", error);
    if (error.code === 401) throw error;

    const customError = new Error("로그인 처리 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

// 토큰 생성
// type에 따라 access, refresh 토큰 발급
function createToken(user, type) {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "refresh" ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL,
  });
  return token;
}

// 토큰 재발급 (Sliding Session)
async function refreshUserToken(userId, currentRefreshToken) {
  const user = await userRepository.findById(userId);

  if (!user || user.refreshToken !== currentRefreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  // 현재 리프레시 토큰의 잔여시간 계산
  const decoded = jwt.verify(currentRefreshToken, process.env.JWT_SECRET);
  const now = Date.now() / 1000;
  const timeLeft = decoded.exp - now;

  const accessToken = createToken(user);
  let newRefreshToken = null;

  // refreshToken의 남은 시간이 SLIDING_THRESHOLD_SEC 이하면 슬라이딩 갱신
  if (timeLeft < SLIDING_THRESHOLD_SEC) {
    newRefreshToken = createToken(user, "refresh");
    await userRepository.update(userId, { refreshToken: newRefreshToken });
  }

  return { accessToken, newRefreshToken };
}

// 비밀번호 변경
async function changePassword(userId, currentPassword, newPassword) {
  try {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error = new Error("사용자를 찾을 수 없습니다.");
      error.code = 404;
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
    if (error.code) throw error;

    const customError = new Error("비밀번호 변경 중 오류가 발생했습니다.");
    customError.code = 500;
    throw customError;
  }
}

// 로그아웃
async function logout(userId) {
  try {
    // 사용자의 refreshToken을 null로 업데이트
    await userRepository.update(userId, { refreshToken: null });
    return true;
  } catch (error) {
    console.error("❌ 로그아웃 중 오류 발생:", error);
    const customError = new Error("로그아웃 처리 중 오류가 발생했습니다");
    customError.code = 500;
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
