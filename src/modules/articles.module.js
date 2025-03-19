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

/**
 * 게시글 조회하기
 */
articleRouter.get("/", async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany();

    if (!articles) throw new Error("게시글이 존재하지 않습니다.");
    res.json(articles);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 상세 조회하기
 */
articleRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle)
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });

    res.json(existingArticle);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 수정하기
 */

articleRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { title, content } = req.body;
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle)
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    res.json(article);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 삭제하기
 */
articleRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const deleteArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!deleteArticle)
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });

    await prisma.article.delete({ where: { id: articleId } });

    res.status(200).send("상품이 삭제되었습니다.");
  } catch (e) {
    next(e);
  }
});

module.exports = articleRouter;
