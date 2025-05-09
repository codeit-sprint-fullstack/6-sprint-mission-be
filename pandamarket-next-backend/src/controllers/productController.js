import productService from "../services/productService.js";
import express from "express";

const productController = express.Router();

productController.get("/", async (req, res, next) => {
  try {
    const { keyword, orderBy } = req.query;
    const products = await productService.getProducts(keyword, orderBy);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

productController.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const products = await productService.getById(id);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

productController.post("/", async (req, res, next) => {
  try {
    const { email, nickname, password, image } = req.body;
    if (!email || !nickname || !password) {
      const error = new Error("모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createUser({
      email,
      nickname,
      password,
      image,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

productController.patch("/:id", async (req, res, next) => {});

productController.delete("/:id", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
});

export default productController;
