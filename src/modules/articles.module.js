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
 * 게시글 수정
 */
articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const data = req.body;
    const { title, content } = data;

    await prisma.$transaction(async (tx) => {
      const article = await tx.article.update({
        where: { id: articleId },
        data: { title, content },
      });

      res.json(article);
    });
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
    await prisma.article.delete({ where: { id: articleId } });
    if (!articleId) throw new Error("Article Not Founded");

    res.status(204).send("Article Deleted");
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 목록 조회
 */
articlesRouter.get("/", async (req, res, next) => {
  try {
    const offset = Number(req.query.offset);
    const search = req.query.search;

    const options = {};

    options.orderBy = { createdAt: "desc" };

    if (offset) options.skip = offset;

    if (search)
      options.where = {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      };

    const articles = await prisma.article.findMany(options);

    res.json(articles);
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
