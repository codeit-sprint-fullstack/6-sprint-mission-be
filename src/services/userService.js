import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
function filterSensitiveUserData(user) {
  const { encryptedPassword, ...rest } = user;
  return rest;
}
async function createUser(user) {
  console.log("user", user);
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    console.log("existedUser", existedUser);
    if (existedUser) {
      const error = new Error("User already exists");
      error.code = 422;
      error.data = { email: user.email };
      throw error;
    }

    const hashedPassword = await hashPassword(user.encryptedPassword);
    console.log("hashPassword", hashPassword);
    const createdUser = await userRepository.save({
      ...user,
      encryptedPassword: hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
  } catch (error) {
    if (error.code === 422) throw error; // 기존의 중복 체크 에러는 그대로 전달

    // Prisma 에러를 애플리케이션에 맞는 형식으로 변환
    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

async function verifyPassword(inputPassword, dbPassword) {
  const isMatch = await bcrypt.compare(inputPassword, dbPassword);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  } else {
    return isMatch;
  }
}
function createToken(user) {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}
async function getUser({ email, inputPassword }) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다.");
      error.code = 401;
      throw error;
    }
    const isVerified = await verifyPassword(
      inputPassword,
      user.encryptedPassword
    );
    if (isVerified) {
      return filterSensitiveUserData(user);
    }
  } catch (error) {
    if (error.code === 401) throw error;
    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

export default {
  createUser,
  getUser,
  createToken,
};
