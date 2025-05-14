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
  const images = req.files;
  const baseUrl = `${req.protocol}://${req.get("host")}/images`;

  try {
    const newProduct = await productService.createProduct(req.body, images);

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

// TODO: 상품 상세조회, 상품 좋아요, 상품 좋아요 취소에 user 인증 미들웨어 달고, req.auth로 들어오는 user정보에서 id를 추출한 다음에 userId를 넘겨주기
// 상품 좋아요
const addlikeProduct = async (req, res, next) => {
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
