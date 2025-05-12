import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SLIDING_THRESHOLD_SEC,
} from "../constants/token.js";

// 패스워드 암호화
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// 유저 정보 필터링
function filterSensitiveUserData(user) {
  const { encryptedPassword, refreshToken, ...rest } = user;
  return rest;
}

// 회원가입
// 회원가입후 해당 정보로 refresh토큰 발급 및 업데이트
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

    return filterSensitiveUserData(createdUser);
  } catch (error) {
    console.error("🔥 실제 Prisma 에러:", error); // 👈 이거 추가
    if (error.code === 422) throw error; // 기존의 중복 체크 에러는 그대로 전달

    // Prisma 에러를 애플리케이션에 맞는 형식으로 변환
    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

// 유저 인증 - 로그인
async function getUser(email, password) {
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
    if (error.code === 401) throw error;
    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

// 유저 id 검사
async function getUserById(id) {
  const user = await userRepository.findById(id);

  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

// 유저 패스워드 검사
// async function verifyPassword(inputPassword, password) {
//   const isMatch = await bcrypt.compare(inputPassword, password);
//   // const isMatch = inputPassword === password;
//   if (!isMatch) {
//     const error = new Error("비밀번호가 일치하지 않습니다.");
//     error.code = 401;
//     throw error;
//   }
// }

// 에러 확인용
async function verifyPassword(inputPassword, password) {
  try {
    console.log("🔑 입력 비밀번호:", inputPassword);
    console.log("🔒 저장된 해시:", password);

    const isMatch = await bcrypt.compare(inputPassword, password);
    console.log("✅ bcrypt.compare 결과:", isMatch);

    if (!isMatch) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.code = 401;
      throw error;
    }
  } catch (err) {
    console.error("❌ bcrypt 에러:", err); // 🔥 이 부분에서 Render 오류 발생 가능
    throw new Error("비밀번호 비교 중 에러 발생");
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

// 유저 정보 업데이트
async function updateUser(id, data) {
  // userRepository 에서 적절한 함수를 찾아 호출하세요
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

// jwt 슬라이딩 세션
async function refreshToken(userId, currentRefreshToken) {
  const user = await userRepository.findById(userId);

  //   쿠키 만료시 실행 - 14일 초과시
  if (!user || user.refreshToken !== currentRefreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  // 현재 리프레쉬 토큰의 잔여시간 계산
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

export default {
  createUser,
  getUser,
  getUserById,
  createToken,
  updateUser,
  refreshToken,
};
