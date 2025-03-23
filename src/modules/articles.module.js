const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articlesRouter = express.Router();

/**
 * 게시글 등록
 */

articlesRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const { title, content } = data;

    const article = await prisma.article.create({ data: { title, content } });

    console.log("data", data);

    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 조회
 */
articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (articleId === NaN) throw new Error("ArticleId must be number");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    if (!article) throw new Error("No article found");

    res.json(article);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 목록 조회
 */
articlesRouter.get("/", async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const article = await prisma.article.findMany({
      where: {
        OR: [
          {
            title: { contains: search },
            content: { contains: search },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
    res.json(article);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 수정
 */
articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const articleId = Number(req.params.articleId);

    if (articleId === NaN) throw new Error("ArticleId must be number");

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return res.status(404).json({ error: "수정할 글이 없습니다." });
    }

    const updateArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    res.json(updateArticle);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 삭제
 */
articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    if (articleId === NaN) throw new Error("ArticleId must be number");

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!existingArticle) {
      return res.status(404).json({ error: "삭제할 글이 없습니다." });
    }
    await prisma.article.delete({
      where: { id: articleId },
    });
    res.send();
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
