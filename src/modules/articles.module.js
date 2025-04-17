const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const commentsRouter = require("./comments.module");

const articlesRouter = express.Router();

articlesRouter.use("/:articleId/comments", commentsRouter);

/**
 * 게시글 등록
 */
articlesRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const { title, content } = data;
    if (!title || !content)
      throw new Error("게시글 제목과 내용을 입력해주세요.");

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
    if (isNaN(articleId)) throw new Error("게시글 Id는 숫자여야 합니다.");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    if (!article) throw new Error("게시글을 찾을 수 없습니다.");

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

    if (isNaN(articleId)) throw new Error("게시글 Id는 숫자여야 합니다.");

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
    if (!articleId) throw new Error("게시글을 찾을 수 없습니다.");

    await prisma.article.delete({ where: { id: articleId } });

    res.status(204).send();
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
