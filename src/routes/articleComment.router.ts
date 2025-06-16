import express from "express";
import auth from "../middlewares/auth";
import articleCommentController from "../controllers/articleComment.controller";

const articleCommentRouter = express.Router();

const ARTICLE_COMMENT = "/:articleId/comments";

// 게시글 댓글 불러오기
articleCommentRouter.get(
  `${ARTICLE_COMMENT}`,
  auth.verifyAccessToken,
  articleCommentController.getComments
);

// 게시글 댓글 작성
articleCommentRouter.post(
  `${ARTICLE_COMMENT}`,
  auth.verifyAccessToken,
  articleCommentController.createComment
);

// 게시글 댓글 수정
articleCommentRouter.patch(
  `${ARTICLE_COMMENT}/:commentId`,
  auth.verifyAccessToken,
  articleCommentController.updateComment
);

// 게시글 댓글 삭제
articleCommentRouter.delete(
  `${ARTICLE_COMMENT}/:commentId`,
  auth.verifyAccessToken,
  articleCommentController.deleteComment
);

export default articleCommentRouter;
