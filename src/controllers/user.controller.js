// src/controllers/user.controller.js
const prismaClient = require("../models/prisma/prismaClient.js");
const catchAsync = require("../utils/catchAsync.js");

exports.getMe = catchAsync(async (req, res) => {
  // req.user를 통해 인증된 사용자 정보 접근
  res.send(req.user);
});

exports.updateMe = catchAsync(async (req, res) => {
  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data: req.body,
  });
  res.send(updatedUser);
});

exports.updatePassword = catchAsync(async (req, res) => {
  // 비밀번호 업데이트 로직 구현 (bcrypt 사용)
  res.send({ message: "Password updated" });
});

exports.getMyProducts = catchAsync(async (req, res) => {
  const products = await prismaClient.product.findMany({
    where: { userId: req.user.id },
  });
  res.send(products);
});

exports.getMyFavorites = catchAsync(async (req, res) => {
  // 찜 목록 조회 로직 구현 (Product 모델에 favorites 관계 추가 필요)
  res.send({ message: "User favorites" });
});
