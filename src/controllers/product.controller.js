// src/controllers/product.controller.js
const catchAsync = require("../utils/catchAsync.js");
const productService = require("../services/product.service.js");

createProduct = catchAsync(async (req, res) => {
  const newProduct = await productService.createProduct(req.body, req.user.id);
  res.status(201).send(newProduct);
});

getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  res.status(200).send(products);
});

getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(
    parseInt(req.params.productId)
  );
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  res.status(200).send(product);
});

updateProduct = catchAsync(async (req, res) => {
  await productService.updateProduct(parseInt(req.params.productId));
  res.status(204).send("성공적으로 수정했습니다.");
});

deleteProductById = catchAsync(async (req, res) => {
  await productService.deleteProductById(parseInt(req.params.productId));
  res.status(204).send("성공적으로 삭제했습니다."); // 디버깅 용도로 deletedProduct.id 반환중
});

addToFavorites = catchAsync(async (req, res) => {
  // 찜 목록 추가 로직 구현 (User 모델에 favorites 관계 추가 필요)
  res.send({ message: "Added to favorites" });
});

removeFromFavorites = catchAsync(async (req, res) => {
  // 찜 목록 제거 로직 구현 (User 모델에 favorites 관계 추가 필요)
  res.status(204).send();
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
  addToFavorites,
  removeFromFavorites,
};
