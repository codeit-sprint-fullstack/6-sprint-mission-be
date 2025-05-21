import productService from '../services/productService.js';

const productController = {
  createProduct: async (req, res, next) => {
    try {
      const { name, description, price, tags, images } = req.body;
      const {userId} = req.auth;  
      const newProduct = await productService.createProduct(userId, name, description, price, tags, images);
      return res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req, res, next) => {
    try {
      const { page = 1, pageSize: limit = 10, orderBy: sort = 'recent', keyword: search } = req.query;
      const products = await productService.getProducts(sort, search, parseInt(page), parseInt(limit));
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(parseInt(productId));
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { name, description, price, tags, images } = req.body;
       const {userId} = req.auth;  
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
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
       const {userId} = req.auth;  
      await productService.deleteProduct(parseInt(productId), userId);
      return res.status(204).send();   
    } catch (error) {
      next(error);
    }
  },
};

export default productController;