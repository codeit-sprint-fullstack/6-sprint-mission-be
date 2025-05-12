// src/controllers/product.controller.js
const catchAsync = require("../utils/catchAsync.js");
const productService = require("../services/product.service.js");

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await productService.createProduct(req.body, req.user.id);
  res.status(201).send(newProduct);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  res.status(200).send(products);
});

exports.getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(
    parseInt(req.params.productId)
  );
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  res.status(200).send(product);
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
