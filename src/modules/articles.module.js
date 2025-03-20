const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articlesRouter = express.Router();

// 게시글 등록
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

// 게시글 조회
articlesRouter.get("/:articleId", async (req, res, next) => {
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

    if (!article) throw new Error("해당 id에 게시글이 없습니다.");

    res.json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 목록 조회 및 검색
articlesRouter.get("/", async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const options = {
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : undefined,
    };

    const articles = await prisma.article.findMany(options);

    res.json(articles);
  } catch (e) {
    next(e);
  }
});

// 게시글 수정
articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content } = req.body;

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    if (!articleId) throw new Error("해당 id에 게시글이 없습니다.");

    res.json(updatedArticle);
  } catch (e) {
    next(e);
  }
});

// 게시글 삭제
articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    await prisma.article.delete({ where: { id: articleId } });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
