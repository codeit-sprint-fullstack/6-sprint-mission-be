import productRepository from '../repositories/product.repository';
import { Product } from '@prisma/client';

const productService = {
  createProduct: async (
    userId: string,
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[]
  ): Promise<Product> => {
    return productRepository.createProduct(userId, name, description, price, tags, images);
  },

  getProducts: async (
    sort: string,
    search: string | undefined,
    page: number,
    limit: number
  ): Promise<Product[]> => {
    const skip = (page - 1) * limit;
    const products = await productRepository.findAllProducts(sort, search, skip, limit);
    return products;
  },

  getProductById: async (id: number): Promise<Product> => {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  updateProduct: async (
    id: number,
    userId: string,
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[]
  ): Promise<Product> => {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return productRepository.updateProduct(id, name, description, price, tags, images);
  },

  deleteProduct: async (id: number, userId: string): Promise<void> => {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.userId !== userId) {
      throw new Error('Unauthorized');
    }
    await productRepository.deleteProduct(id);
  },
};

export default productService; 