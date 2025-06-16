import * as productRepository from '../repositories/product.repository'; // productRepository의 모든 export를 가져옵니다.

export async function createProduct(productData: any, userId: number) {
  const newProduct = await productRepository.create(productData, userId);
  return newProduct;
}

export async function getAllProducts() {
  const products = await productRepository.getAll();
  return products;
}

export async function getProductById(productId: number) {
  const product = await productRepository.getById(productId);
  return product;
}

export async function updateProduct(productId: number, updateData: any) {
  const updatedProduct = await productRepository.update(productId, updateData);
  return updatedProduct;
}

export async function deleteProductById(productId: number) {
  const deletedProduct = await productRepository.deleteById(productId);
  return deletedProduct;
}