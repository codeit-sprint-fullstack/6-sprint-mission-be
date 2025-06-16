import express from "express";
import auth from "../middlewares/auth";
import productCommentController from "../controllers/productComment.controller";

const productCommentRouter = express.Router();

const PRODUCT_COMMENT = "/:productId/comments";

// 상품 댓글 불러오기
productCommentRouter.get(
  `${PRODUCT_COMMENT}`,
  auth.verifyAccessToken,
  productCommentController.getComments
);

// 상품 댓글 작성
productCommentRouter.post(
  `${PRODUCT_COMMENT}`,
  auth.verifyAccessToken,
  productCommentController.createComments
);

// 상품 댓글 수정
productCommentRouter.patch(
  `${PRODUCT_COMMENT}/:commentId`,
  auth.verifyAccessToken,
  productCommentController.updateComment
);

// 상품 댓글 삭제
productCommentRouter.delete(
  `${PRODUCT_COMMENT}/:commentId`,
  auth.verifyAccessToken,
  productCommentController.deleteComment
);

export default productCommentRouter;
