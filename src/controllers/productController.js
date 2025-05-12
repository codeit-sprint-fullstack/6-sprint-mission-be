import productService from "../services/productService.js";

// 상품 목록 불러오기
const getProducts = async (req, res, next) => {
  try {
    const [products, totalCount] = await productService.getProducts(req.query);

    res.status(200).json({ list: products, totalCount });
  } catch (e) {
    next(e);
  }
};

// 상품 상세조회
const getProduct = async (req, res, next) => {
  const productId = Number(req.params.productId);

  try {
    const product = await productService.getProduct(productId);

    res.status(200).json(product);
  } catch (e) {
    next(e);
  }
};

// 상품 등록
const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);

    res.status(201).json(newProduct);
  } catch (e) {
    next(e);
  }
};

// 상품 수정
const updateProduct = async (req, res, next) => {
  const productId = Number(req.params.productId);

  try {
    const updatedProduct = await productService.updateProduct(
      productId,
      req.body
    );

    res.status(200).json(updatedProduct);
  } catch (e) {
    next(e);
  }
};

// 상품 삭제
const deleteProduct = async (req, res, next) => {
  const productId = Number(req.params.productId);

  try {
    await productService.deleteProduct(productId);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
