import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const articlesRouter = express.Router();

//게시글 등록

articlesRouter.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({ data: { title, content } });
    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 목록 조회
articlesRouter.get("/", async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    res.json(articles);
  } catch (e) {
    next(e);
  }
});

// 게시글 하나만 조회
articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    if (isNaN(articleId)) throw new Error("아티클~~~~");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    if (!article) return res.status(404).json({ error: "아티클 못찾음" });

    res.json(article);
  } catch (e) {
    next(e);
  }
});

//게시글 수정

articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const articleId = Number(req.params.articleId);

    if (isNaN(articleId)) throw new Error("아티클 오류");

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) return res.status(404).json({ error: "아티클" });

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    res.json(updatedArticle);
  } catch (e) {
    next(e);
  }
});

//게시글 삭제

articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    if (isNaN(articleId)) throw new Error("ArticleId must be a number");

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle)
      return res.status(404).json({ error: "Article not found" });

    await prisma.article.delete({
      where: { id: articleId },
    });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

//댓글 등록

articlesRouter.post("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    if (isNaN(articleId)) throw new Error("ArticleId must be a number");

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
      },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

//댓글 수정

articlesRouter.patch(
  "/:articleId/comments/:commentId",
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const articleId = Number(req.params.articleId);
      const commentId = Number(req.params.commentId);

      if (isNaN(articleId) || isNaN(commentId)) {
        throw new Error("ArticleId and CommentId must be numbers");
      }

      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!existingComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });

      res.json(updatedComment);
    } catch (e) {
      next(e);
    }
  }
);

//댓글 삭제

articlesRouter.delete(
  "/:articleId/comments/:commentId",
  async (req, res, next) => {
    try {
      const articleId = Number(req.params.articleId);
      const commentId = Number(req.params.commentId);

      if (isNaN(articleId) || isNaN(commentId)) {
        throw new Error("ArticleId and CommentId must be numbers");
      }

      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!existingComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

//댓글 목록 조회

articlesRouter.get("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;

    const comments = await prisma.comment.findMany({
      where: { articleId },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

export default articlesRouter;
