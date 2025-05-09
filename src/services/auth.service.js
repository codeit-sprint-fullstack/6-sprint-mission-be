// src/services/auth.service.js
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config"); // 환경 변수 설정 파일

async function signUp(userData) {
  // 1. 이메일 중복 확인
  const existingUser = await userModel.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("Email already taken"); // 또는 사용자 정의 에러
  }

  // 2. 사용자 생성 (비밀번호는 Model에서 암호화)
  const newUser = await userModel.create(userData);

  // 3. 토큰 생성 (선택 사항: 회원가입 후 바로 로그인 처리)
  const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return { user: newUser, token };
}

async function signIn(email, password) {
  // 1. 사용자 조회
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 2. 비밀번호 검증
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  // 3. 토큰 생성
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return { user, token };
}

async function refreshToken(refreshToken) {
  // 1. Refresh Token 검증 로직 (DB에 저장된 토큰과 비교 등) - 구현 필요
  // 2. 새로운 Access Token 생성
  const decoded = jwt.verify(refreshToken, config.jwtSecret); // Refresh Token 검증
  const newToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  return newToken;
}

module.exports = { signUp, signIn, refreshToken };
