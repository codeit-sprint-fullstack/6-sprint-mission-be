import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const articleRouter = express.Router();

// 게시글 목록 불러오기
articleRouter.get("/", async (req, res, next) => {
  try {
    const { offset, limit, orderBy, keyword } = req.query;
    const filter = {
      OR: [
        { title: { contains: keyword || "", mode: "insensitive" } },
        { content: { contains: keyword || "", mode: "insensitive" } },
      ],
    };

    const articles = await prisma.article.findMany({
      where: filter,
      skip: (Number(offset) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      orderBy: { createdAt: orderBy === "recent" ? "desc" : "asc" },
      omit: { updatedAt: true },
    });

    const totalCount = await prisma.article.count({ where: filter });

    res.json({ list: articles, totalCount });
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
    if (!article) throw new Error("해당 게시글을 찾을 수 없습니다.");

    res.json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 작성
articleRouter.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title) throw new Error("제목을 입력해주세요.");
    if (!content) throw new Error("내용을 입력해주세요.");

    const newArticle = await prisma.article.create({
      data: { title, content },
    });

    res.status(201).json(newArticle);
  } catch (e) {
    next(e);
  }
});

// 게시글 수정
articleRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const articleId = Number(req.params.articleId);
    if (!(title || content)) throw new Error("수정할 내용을 입력해주세요.");

    await prisma.$transaction(async (tx) => {
      const article = await tx.article.findUnique({ where: { id: articleId } });
      if (!article) throw new Error("게시글을 찾을 수 없습니다.");

      const updateArticle = await tx.article.update({
        where: { id: articleId },
        data: { title, content },
      });

      res.status(200).json(updateArticle);
    });
  } catch (e) {
    next(e);
  }
});

// 게시글 삭제
articleRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    await prisma.$transaction(async (tx) => {
      const article = await tx.article.findUnique({ where: { id: articleId } });
      if (!article) throw new Error("이미 삭제된 게시글 입니다.");

      await prisma.article.delete({ where: { id: articleId } });

      res.sendStatus(204);
    });
  } catch (e) {
    next(e);
  }
});

export default articleRouter;
