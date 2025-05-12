// src/services/auth.service.js
const prisma = require("../repositories/prisma/prismaClient.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const ApiError = require("../utils/apiError.js");

async function signUp(userData) {
  if (await prisma.user.findUnique({ where: { email: userData.email } })) {
    throw new ApiError(400, "Email already taken");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });
  return user;
}

async function signIn(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Incorrect email or password");
  }
  const token = generateToken(user.id);
  return { user, token };
}

async function refreshToken(refreshToken) {
  // Refresh token 검증 로직 구현 (일반적으로 Redis 등에 저장하여 관리)
  // ...
  const userId = verifyRefreshToken(refreshToken);
  const newToken = generateToken(userId);
  return newToken;
}

function generateToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
}

// function verifyRefreshToken(token) { ... } // Refresh token 검증 함수 구현

module.exports = {
  signUp,
  signIn,
  refreshToken,
};
