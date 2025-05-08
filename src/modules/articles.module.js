const express = require("express");
const prisma = require("../db/client.prisma");
const {
  GetArticleListReqStruct,
} = require("../structs/article/GetArticleListReqStruct");
const { create } = require("domain");
const { Article } = require("../models/Article");

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

    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 목록 조회하기
 */
articleRouter.get("/", async (req, res, next) => {
  const { cursor, orderBy, word } = create(req.query, GetArticleListReqStruct);

  const parsedTake = parseInt(req.query.take) || 10;

  try {
    const articleEntities = await prisma.article.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: parsedTake + 1,
      orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
      where: word ? { title: { contains: word } } : undefined,
    });

    const articles = articleEntities.map(
      (articleEntitiy) => new Article(articleEntitiy)
    );

    const hasNext = articles.length === parsedTake + 1;

    return res.send({
      data: articles.slice(0, parsedTake).map((article) => ({
        id: article.getId(),
        title: article.getTitle(),
        content: article.getContent(),
        createdAt: article.getCreatedAt(),
      })),
      hasNext,
      nextCursor: hasNext ? articles[articles.length - 1].getId() : null,
    });

    // res.json(articles);
  } catch (e) {
    next(e);
  }
});

// 게시글 목록 조회하기 (베스트 3개만)
articleRouter.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const articles = await prisma.article.findMany({ take: limit });

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
    if (articleId === NaN) throw new Error("아이디가 숫자가 아닙니다.");

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    if (!existingArticle)
      return res.status(404).send("존재하지 않는 게시글입니다.");

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
      return res.status(404).json("존재하지 않는 게시글입니다.");

    await prisma.article.delete({ where: { id: articleId } });

    res.status(200).send("게시글이 삭제되었습니다.");
  } catch (e) {
    next(e);
  }
});

module.exports = articleRouter;
