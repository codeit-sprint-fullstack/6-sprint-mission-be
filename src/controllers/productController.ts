import express, { NextFunction, Request, Response } from "express";
import auth from "../middlewares/auth";
import productService from "../services/productService";
import { AuthenticationError } from "../types/error";

const productController = express.Router();

productController.post(
  "/",
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new AuthenticationError("failed to authenticate");
    }
    const { userId } = req.auth;
    try {
      const product = {
        ...req.body,
        ownerId: userId,
      };
      const createdProduct = await productService.create(product);
      res.json(createdProduct);
    } catch (error) {
      next(error);
    }
  }
);

productController.get("/", async (req: Request, res: Response) => {
  const products = await productService.getAll();
  res.json(products);
});

productController.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getById(+id);
  res.json(product);
});

export default productController;
