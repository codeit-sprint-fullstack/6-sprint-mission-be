import express from "express";
import articleController from "../controllers/articleController.js";

const articleRouter = express.Router();

// 게시글 목록 불러오기
articleRouter.get("/", articleController.getArticles);

// 게시글 상세조회
articleRouter.get("/:articleId", articleController.getArticle);

// 게시글 작성
articleRouter.post("/", articleController.createArticle);

// 게시글 수정
articleRouter.patch("/:articleId", articleController.updateArticle);

// 게시글 삭제
articleRouter.delete("/:articleId", articleController.deleteArticle);

// 게시글 좋아요
articleRouter.post("/:articleId/like", articleController.addlikeArticle);

// 게시글 좋아요 취소
articleRouter.delete("/:articleId/like", articleController.cancelLikeArticle);

export default articleRouter;
