import express from "express";
import productService from "../services/productService.js";
import varify from "../middlewares/varify.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/images.js";
import { authenticate } from "../middlewares/utils.js";
import jwt from "jsonwebtoken";

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
    // varify.requestStructure,
    auth.varifyAccessToken,
    upload.single("image"),
    async (req, res, next) => {
      try {
        const parsedTags = (() => {
          try {
            const tags = JSON.parse(req.body.tags);
            return Array.isArray(tags) ? tags : [tags];
          } catch (e) {
            return [req.body.tags];
          }
        })();

        const accessToken = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;

        const data = {
          name: req.body.name,
          description: req.body.description,
          price: Number(req.body.price),
          tags: parsedTags,
          imageUrl: req.file
            ? `http://localhost:3000/uploads/${req.file.filename}`
            : null,
          authorId: userId,
        };

        const createProduct = await productService.create(data);

        return res.json(createProduct);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(async (req, res, next) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        orderBy = "recent",
        keyword = "",
      } = req.query;

      const take = parseInt(pageSize);
      const skip = (parseInt(page) - 1) * take;
      const orderField =
        orderBy === "recent"
          ? "createdAt"
          : orderBy === "favorite"
          ? "favorite"
          : "createdAt";

      const validOrderOption = ["recent", "favorite"];
      if (!validOrderOption.includes(orderBy)) {
        return res.status(400).json({ message: "잘못된  요청입니다." });
      }

      const product = await productService.getAll({
        order: orderField,
        skip,
        take,
        keyword,
      });

      if (!product) varify.throwNotFoundError();

      return res.json(product);
    } catch (error) {
      next(error);
    }
  });

//상품 상세 조회
productController.get("/:id", authenticate, async (req, res, next) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    const product = await productService.getById(id, userId);

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
    const id = Number(req.params.id);
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
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
