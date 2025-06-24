import { Response, NextFunction } from "express";
import productService from "../services/product.service";
import { AuthRequest } from "../Types/user";
import { ProductQueryParams } from "../Types/product";

const productController = {
  createProduct: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, description, price, tags, images } = req.body;
      const { userId } = req.auth!;
      const newProduct = await productService.createProduct(
        userId,
        name,
        description,
        price,
        tags,
        images
      );
      return res.status(201).json(newProduct);
    } catch (error) {
      next(error);
      return;
    }
  },

  getProducts: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        page = "1",
        pageSize: limit = "10",
        orderBy: sort = "recent",
        keyword: search,
      } = req.query as ProductQueryParams;
      const products = await productService.getProducts(
        sort,
        search,
        parseInt(page),
        parseInt(limit)
      );
      return res.status(200).json(products);
    } catch (error) {
      next(error);
      return;
    }
  },

  getProductById: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(parseInt(productId));
      return res.status(200).json(product);
    } catch (error) {
      next(error);
      return;
    }
  },

  updateProduct: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { productId } = req.params;
      const { name, description, price, tags, images } = req.body;
      const { userId } = req.auth!;
      const updatedProduct = await productService.updateProduct(
        parseInt(productId),
        userId,
        name,
        description,
        price,
        tags,
        images
      );
      return res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
      return;
    }
  },

  deleteProduct: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { productId } = req.params;
      const { userId } = req.auth!;
      await productService.deleteProduct(parseInt(productId), userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
      return;
    }
  },
};

export default productController;
