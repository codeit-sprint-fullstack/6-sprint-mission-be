import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as productService from '../services/product.service';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const newProduct = await productService.createProduct(req.body, (req.user as any).id);
  res.status(201).send(newProduct);
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.status(200).send(products);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(parseInt(req.params.productId));
  if (!product) {
    return res.status(404).send({ message: 'Product not found' });
  }
  res.status(200).send(product);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.updateProduct(parseInt(req.params.productId), req.body);
  res.status(204).send('No Content');
});

export const deleteProductById = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProductById(parseInt(req.params.productId));
  res.status(204).send('No Content');
});

export const addToFavorites = catchAsync(async (req: Request, res: Response) => {
  res.send({ message: 'Added to favorites' });
});

export const removeFromFavorites = catchAsync(async (req: Request, res: Response) => {
  res.status(204).send();
});