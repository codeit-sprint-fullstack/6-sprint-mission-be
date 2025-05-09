// src/services/user.service.js
const userModel = require("../models/user.model.js");
// const bcrypt = require("bcrypt"); // 비밀번호 암호화 필요시

async function getMe(userId) {
  return userModel.findById(userId);
}

async function updateMe(userId, updateData) {
  return userModel.update(userId, updateData);
}

async function updatePassword(userId, newPassword) {
  // 1. 사용자 조회
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // 2. 새 비밀번호 암호화
  // const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. 사용자 정보 업데이트
  return userModel.update(userId, {
    password: newPassword /* hashedPassword */,
  });
}

async function getMyProducts(userId) {
  return userModel.findProductsByUserId(userId);
}

async function getMyFavorites(userId) {
  // User 모델에 favorites 관계가 설정되어 있다면 Model 함수 호출
  // const userWithFavorites = await userModel.findFavoritesByUserId(userId);
  // return userWithFavorites ? userWithFavorites.favorites : [];
  return { message: "User favorites (Service Layer)" }; // 임시 응답
}

module.exports = {
  getMe,
  updateMe,
  updatePassword,
  getMyProducts,
  getMyFavorites,
};
