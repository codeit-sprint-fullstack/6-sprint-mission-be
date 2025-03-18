const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articleRouter = express.Router();

/**
 * 게시글 등록하기
 */
articleRouter.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: { title, content },
    });
    res.json(article);
  } catch (e) {
    next(e);
  }
});

module.exports = articleRouter;
