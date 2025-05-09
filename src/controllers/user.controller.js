// src/controllers/user.controller.js
const userService = require("../services/user.service.js");
const catchAsync = require("../utils/catchAsync.js");

exports.getMe = catchAsync(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.send(user);
});

exports.updateMe = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateMe(req.user.id, req.body);
  res.send(updatedUser);
});

exports.updatePassword = catchAsync(async (req, res) => {
  await userService.updatePassword(req.user.id, req.body.newPassword); // 요청에서 새 비밀번호 추출
  res.send({ message: "Password updated" });
});

exports.getMyProducts = catchAsync(async (req, res) => {
  const products = await userService.getMyProducts(req.user.id);
  res.send(products);
});

exports.getMyFavorites = catchAsync(async (req, res) => {
  const favorites = await userService.getMyFavorites(req.user.id);
  res.send(favorites);
});
