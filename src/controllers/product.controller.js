// src/controllers/product.controller.js
const productService = require("../services/product.service.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await productService.createProduct({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).send(newProduct);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  res.send(products);
});

exports.getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId, {
    tags,
    user,
    comments,
  });
  res.send(product);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await productService.updateProduct(
    req.params.productId,
    req.body
  );
  res.send(updatedProduct);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.productId);
  res.status(204).send();
});

exports.addToFavorites = catchAsync(async (req, res) => {
  const result = await productService.addToFavorites(
    req.user.id,
    req.params.productId
  );
  res.send(result);
});

exports.removeFromFavorites = catchAsync(async (req, res) => {
  await productService.removeFromFavorites(req.user.id, req.params.productId);
  res.status(204).send();
});
