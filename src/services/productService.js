import productRepository from '../repositories/productRepository.js';

const productService = {
  createProduct: async (userId, name, description, price, tags, images) => {
    return productRepository.createProduct(userId, name, description, price, tags, images);
  },

  getProducts: async () => {
    return productRepository.findAllProducts();
  },

  getProductById: async (id) => {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw { status: 404, message: '상품을 찾을 수 없습니다.' };
    }
    return product;
  },

  updateProduct: async (id, userId, name, description, price, tags, images) => {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw { status: 404, message: '상품을 찾을 수 없습니다.' };
    }
    if (product.userId !== userId) {
      throw { status: 403, message: '상품 수정 권한이 없습니다.' };
    }
    return productRepository.updateProduct(id, name, description, price, tags, images);
  },

  deleteProduct: async (id, userId) => {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw { status: 404, message: '상품을 찾을 수 없습니다.' };
    }
    if (product.userId !== userId) {
      throw { status: 403, message: '상품 삭제 권한이 없습니다.' };
    }
    return productRepository.deleteProduct(id);
  },
};

export default productService;