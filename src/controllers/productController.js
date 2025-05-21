import productService from "../services/productService.js";

// 상품 목록 불러오기
const getProducts = async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/images`;

  try {
    const [products, totalCount] = await productService.getProducts(req.query);

    const productsWithImages = products.map((product) => ({
      ...product,
      productImages: undefined,
      images: product.productImages.map((img) => `${baseUrl}/${img.imageUrl}`),
    }));

    res.status(200).json({ list: productsWithImages, totalCount });
  } catch (e) {
    next(e);
  }
};

// 상품 상세조회
const getProduct = async (req, res, next) => {
  const userId = req.auth.id;
  const productId = Number(req.params.productId);
  const baseUrl = `${req.protocol}://${req.get("host")}/images`;

  try {
    const product = await productService.getProduct(userId, productId);

    const imageUrls = product.images.map(
      (imageUrl) => `${baseUrl}/${imageUrl}`
    );

    res.status(200).json({ ...product, images: imageUrls });
  } catch (e) {
    next(e);
  }
};

// 상품 등록
const createProduct = async (req, res, next) => {
  const userId = req.auth.id;
  const images = req.files;
  const baseUrl = `${req.protocol}://${req.get("host")}/images`;

  try {
    const newProduct = await productService.createProduct(
      userId,
      req.body,
      images
    );

    const imageUrls = newProduct.images.map(
      (imageUrl) => `${baseUrl}/${imageUrl}`
    );

    res.status(201).json({ ...newProduct, images: imageUrls });
  } catch (e) {
    next(e);
  }
};

// 상품 수정
const updateProduct = async (req, res, next) => {
  const userId = req.auth.id;
  const productId = Number(req.params.productId);
  const images = req.files;
  const baseUrl = `${req.protocol}://${req.get("host")}/images`;

  try {
    const updatedProduct = await productService.updateProduct(
      userId,
      productId,
      req.body,
      images
    );

    const imageUrls = updatedProduct.images.map(
      (imageUrl) => `${baseUrl}/${imageUrl}`
    );

    res.status(200).json({ ...updatedProduct, images: imageUrls });
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

// 상품 좋아요
const addlikeProduct = async (req, res, next) => {
  const userId = req.auth.id;
  const productId = Number(req.params.productId);

  try {
    const like = await productService.addlikeProduct(userId, productId);

    res.status(200).json(like);
  } catch (e) {
    next(e);
  }
};

// 상품 좋아요 취소
const cancelLikeProduct = async (req, res, next) => {
  const userId = req.auth.id;
  const productId = Number(req.params.productId);

  try {
    const cancelLike = await productService.cancelLikeProduct(
      userId,
      productId
    );

    res.status(200).json(cancelLike);
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
  addlikeProduct,
  cancelLikeProduct,
};
