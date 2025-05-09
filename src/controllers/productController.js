import express from "express";
import productService from "../services/productService.js";
import varify from "../middlewares/varify.js";
import auth from "../middlewares/auth.js";

const productController = express.Router();
const productCommentController = express.Router();

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

//상품 등록, 전체 상품 조회
productController
  .route("/")
  .post(
    varify.requestStructure,
    auth.varifyAccessToken,
    async (req, res, next) => {
      try {
        const createProduct = await productService.create(req.body);
        return res.json(createProduct);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(async (req, res, next) => {
    try {
      const product = await productService.getAll();

      if (!product) varify.throwNotFoundError();

      return res.json(product);
    } catch (error) {
      next(error);
    }
  });

//상품 상세 조회
productController.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const product = await productService.getById(id);

    if (!product) varify.throwNotFoundError();

    const productCommets = await productService.getAllProductComment(id);

    return res.json({ product, productCommets });
  } catch (error) {
    next(error);
  }
});

//상품 수정, 삭제하기
productController
  .route("/:id")
  .all(auth.varifyAccessToken)
  .patch(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    try {
      const updatedProduct = await productService.update(id, req.body);

      if (!updatedProduct) varify.throwNotFoundError();

      return res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const deletedProduct = await productService.deleteById(id);
    try {
      if (!deletedProduct) {
        const error = new Error("존재하지 않는 상품입니다.");
        error.code = 404;
        throw error;
      }

      return res.json(deletedProduct);
    } catch (error) {
      next(error);
    }
  });

//상품에 댓글등록, 가져오기
productCommentController
  .route("/:id/comments")
  .post(auth.varifyAccessToken, async (req, res, next) => {
    const { userId } = req.auth;
    const id = Number(req.params.id);
    try {
      const createdComment = await productService.createProductComment({
        ...req.body,
        productId: id,
        authorId: userId,
      });
      return res.json(createdComment);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const productComments = await productService.getAllProductComment(id);
      return res.json(productComments);
    } catch (error) {
      next(error);
    }
  });

//중복 컨트롤러 병합
productController.use("/", productCommentController);

export default productController;
