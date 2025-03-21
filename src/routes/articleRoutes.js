import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const articleRouter = express.Router();

// 게시글 목록 불러오기
articleRouter.get("/", async (req, res, next) => {
  try {
    const { offset, limit, orderBy, keyword } = req.query;

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          {
            title: { contains: keyword || "" },
          },
          { content: { contains: keyword || "" } },
        ],
      },
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: { creatdAt: orderBy === "recent" ? "desc" : "asc" },
      omit: { updatedAt: true },
    });

    res.json(articles);
  } catch (e) {
    next(e);
  }
});

// 게시글 상세조회
articleRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      omit: { updatedAt: true },
    });

    res.json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 작성
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

// 게시글 수정
articleRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const articleId = Number(req.params.articleId);

    const updateArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    res.status(200).json(updateArticle);
  } catch (e) {
    next(e);
  }
});

// 게시글 삭제
articleRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    await prisma.article.delete({ where: { id: articleId } });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

export default articleRouter;
