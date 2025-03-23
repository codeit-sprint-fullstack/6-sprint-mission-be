const express = require("express");
const articlesRouter = express.Router();
const prisma = require("../db/prisma/client.prisma");

// post articles
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

// retrieve post by id
articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId); // needed to convert string to number
    // if the articleId not found throw error
    if (articleId === NaN) throw new Error("ArticleId must be number!");

    const article = prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    // if article not found handle error
    if (!article) throw new Error("No articles found");

    // below executed when article is found
    res.json(article);
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
