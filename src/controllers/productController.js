import express from "express";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";

const productController = express.Router();

productController.post("/", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const product = {
      ...req.body,
      ownerId: userId,
    };
    const createdProduct = await productService.create(product);
    return res.json(createdProduct);
  } catch (error) {
    next(error);
  }
});

productController.get("/", async (req, res) => {
  const products = await productService.getAll();
  return res.json(products);
});

productController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

export default productController;
