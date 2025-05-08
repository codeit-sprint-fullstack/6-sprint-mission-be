// src/controllers/product.controller.js
const prismaClient = require("../models/prisma/prismaClient.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await prismaClient.product.create({
    data: { ...req.body, userId: req.user.id },
  });
  res.status(201).send(newProduct);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await prismaClient.product.findMany();
  res.send(products);
});

exports.getProductById = catchAsync(async (req, res) => {
  const product = await prismaClient.product.findUnique({
    where: { id: parseInt(req.params.productId) },
    include: { tags, user, comments }, // 필요에 따라 include
  });
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  res.send(product);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await prismaClient.product.update({
    where: { id: parseInt(req.params.productId) },
    data: req.body,
  });
  res.send(updatedProduct);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await prismaClient.product.delete({
    where: { id: parseInt(req.params.productId) },
  });
  res.status(204).send();
});

exports.addToFavorites = catchAsync(async (req, res) => {
  // 찜 목록 추가 로직 구현 (User 모델에 favorites 관계 추가 필요)
  res.send({ message: "Added to favorites" });
});

exports.removeFromFavorites = catchAsync(async (req, res) => {
  // 찜 목록 제거 로직 구현 (User 모델에 favorites 관계 추가 필요)
  res.status(204).send();
});
