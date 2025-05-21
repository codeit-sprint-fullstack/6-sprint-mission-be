import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function createUser(user) {
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new Error("사용 중인 이메일입니다.");
      error.code = 422;
      throw error;
    }
    const hashedPassword = await hashPassword(user.password);
    const createdUser = await userRepository.save({
      ...user,
      password: hashedPassword,
    });
    return createdUser; //password랑 refreshtoken 제외해야함
  } catch (error) {
    throw error;
  }
}

async function verifyPassword(inputPassword, password) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
}

async function getUser(email, password) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다.");
      error.code = 401;
      throw error;
    }
    await verifyPassword(password, user.encryptedPassword);
    return user; //password랑 refreshtoken 제외해야함
  } catch (error) {
    throw error;
  }
}

function createToken(user, type = "access") {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

async function refreshToken(userId, refreshToken) {
  const user = userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  //new refreshtoken db에 저장?
  return { newAccessToken, newRefreshToken };
}

async function getUserById(userId) {
  const user = userRepository.findById(userId);
  if (!user) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  return user;
}

export default {
  createUser,
  getUser,
  createToken,
  refreshToken,
  getUserById,
};
