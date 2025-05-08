import express from "express";
import productService from "../services/productService.js";
import varify from "../middlewares/varify.js";
import auth from "../middlewares/auth.js";

const productController = express.Router();

//상품 등록
productController.post(
  "/",
  varify.requestStructure,
  auth.varifyAccessToken,
  async (req, res, next) => {
    const createProduct = await productService.create(req.body);
    return res.json(createProduct);
  }
);

// //상품 좋아요 등록
// productController.post(
//   "/:id/favorite",
//   // auth.varifyAccessToken,
//   async (req, res, next) => {
//     const userId = req.user.id
//     const productId = Number(req.params.id)

//     const postLike = await productService.
//     return res.json(createProduct);
//   }
// );

// //상품 좋아요 삭제
// productController.post(
//   "/:id/favorite",
//   // auth.varifyAccessToken,
//   async (req, res, next) => {
//     const createProduct = await productService.create(req.body);
//     return res.json(createProduct);
//   }
// );

//전체 상품 조회
productController.get("/", async (req, res, next) => {
  const product = await productService.getAll();

  if (!product) varify.throwNotFoundError();

  return res.json(product);
});

//상품 상세 조회
productController.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const product = await productService.getById(id);

  if (!product) varify.throwNotFoundError();

  return res.json(product);
});

//상품 좋아요 등록
productController.post("/:id/favorite", async (req, res, next) => {
  const { id } = req.params;
  const product = await productService.getById(id);

  if (!product) varify.throwNotFoundError();

  return res.json(product);
});

//상품 수정하기
productController.patch(
  "/:id",
  auth.varifyAccessToken,
  async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const updatedProduct = await productService.update(id, req.body);

    if (!updatedProduct) varify.throwNotFoundError();

    return res.json(updatedProduct);
  }
);

//상품 삭제하기
productController.delete(
  "/:id",
  auth.varifyAccessToken,
  async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const deletedProduct = await productService.deleteById(id);

    if (!deletedProduct) {
      const error = new Error("존재하지 않는 상품입니다.");
      error.code = 404;
      throw error;
    }

    res.json(deletedProduct);
  }
);

export default productController;
