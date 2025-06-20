const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const errorHandler = require("../middleware/errorHandle.middleware");
const articlesRouter = express.Router();

articlesRouter.post("/", errorHandler, async (req, res, next) => {
  try {
    const data = req.body;
    const { title, content } = data;
    const article = await prisma.article.create({ data: { title, content } });

    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 조회
articlesRouter.get("/:articleId", errorHandler, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
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

// 게시글 목록 조회
articlesRouter.get("/", errorHandler, async (req, res, next) => {
  try {
    const skip = Number(req.query.page);
    const take = Number(req.query.pageSize);
    const search = req.query.keyword;
    const orderBy = req.query.orderBy;
    const options = {};
    if (orderBy === "recent") options.orderBy = { createdAt: "desc" };
    if (take) options.take = take;
    if (skip) options.skip = (skip - 1) * take;
    if (search)
      options.where = {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      };
    const articles = await prisma.article.findMany(options);
    res.json(articles);
  } catch (e) {
    next(e);
  }
});

articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const data = req.body;
    const articleId = req.params.articleId;
    const updatearticle = await prisma.article.update({
      where: { id: articleId },
      data,
    });
    if (!updatearticle) return res.status(404).send("can't find article");
    res.status(204).json(updatearticle);
  } catch (e) {
    next(e);
  }
});

articlesRouter.delete("/:articleId", errorHandler, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const deletearticle = await prisma.article.delete({
      where: { id: articleId },
    });

    if (!deletearticle) return res.status(404).send("can't find article");
    res.status(204).json(deletearticle);
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
