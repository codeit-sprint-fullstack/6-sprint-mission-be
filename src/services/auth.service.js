const userRepository = require("../repositories/users.repository.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 사용자 데이터에서 비밀번호와 토큰 뺌
function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

// 비밀번호 인증
async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);

  if (!isValid) {
    const error = new Error("비밀번호를 잘못 입력하셨습니다.");
    error.code = 400;
    throw error;
  }
}

// 비밀번호 hashing
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// JWT 발급 (= access token)
function createToken(user, type) {
  const payload = { userId: user.id };
  const options = { expiresIn: type === "refresh" ? "2w" : "1h" };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

/**
 * ↑
 * 인증용 함수 / 회원가입·로그인 함수
 * ↓
 */

// 회원가입
async function createUser(user) {
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    const error = new Error("사용 중인 이메일입니다.");
    error.code = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(user.password);

  const newUser = await userRepository.create({
    ...user,
    encryptedPassword: hashedPassword,
  });

  return filterSensitiveUserData(newUser);
}

// 로그인
async function getUser(email, password) {
  // 1) DB에 이메일 있나 확인
  const user = await userRepository.findByEmail(email);

  if (!user) {
    const error = new Error("등록되지 않은 이메일입니다.");
    error.code = 404;
    throw error;
  }

  // 2) 비밀번호 일치 여부 확인하고 민감한 정보 빼서 넘김
  await verifyPassword(password, user.encryptedPassword);
  return filterSensitiveUserData(user);
}

const userService = {
  createUser,
  getUser,
  createToken,
};

module.exports = userService;
