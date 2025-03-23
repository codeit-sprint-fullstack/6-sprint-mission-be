const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articlesrouter = express.Router();

/**
 * 게시글 등록
 */
articlesrouter.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({ data: { title, content } });

    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 조회
 */
articlesrouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (articleId === NaN) throw new Error("ArticleId must be number");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true, createdAt: true },
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
articlesrouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { title, content } = req.body;

    await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 삭제
 */
articlesrouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    await prisma.article.delete({ where: { id: articleId } });
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 목록 조회
 */
articlesrouter.get("/", async (req, res, next) => {
  try {
    const skip = Number(req.query.offset);
    const search = req.query.search;

    const options = {};

    options.orderBy = { createdAt: "desc" };

    if (skip) options.skip = skip;

    if (search)
      options.where = {
        OR: [
          { title: { contains: "어떤 단어" } },
          { content: { contains: "어떤 단어" } },
        ],
      };

    if (Number(req.query.offset)) options.skip = Number(req.query.offset);

    const articles = await prisma.article.findMany(options);

    res.json(articles);
  } catch (e) {
    next(e);
  }
});

module.exports = articlesrouter;
