const express = require("express");
const { article } = require("../db/prisma/client");
const prisma = require("../db/prisma/client");

const articlesRouter = express.Router();

/**
 * 게시글 등록
 */
articlesRouter.post("/", async (req, res, next) => {
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
 * 게시글 목록 조회
 */
articlesRouter.get("/", async (req, res, next) => {
  try {
    const skip = Number(req.query.offset);
    const search = req.query.search;

    const options = {
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    };

    if (!isNaN(skip)) {
      options.skip = skip;
    }

    if (search) {
      options.where = {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      };
    }

    const articles = await prisma.article.findMany(options);

    const formatted = articles.map((article) => {
      const { user, ...rest } = article;
      return {
        ...rest,
        username: user.name,
      };
    });

    res.json(formatted);
  } catch (e) {
    next(e);
  }
});



/**
 * 게시글 목록 조회
 */
articlesRouter.get("/", async (req, res, next) => {
  try {
    const skip = Number(req.query.offset);
    const search = req.query.search;

    const options = {};

    //정렬
    options.orderBy = { createdAt: "desc" };

    //Offset
    if (skip) options.skip = skip;

    //검색
    if (search) {
      options.where = {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      };
    }

    const articles = await prisma.article.findMany(options);

    res.json(articles);
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
    const { title, content } = req.body;

    if (isNaN(articleId)) throw new Error("ArticleId must be a number");

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    if (!updatedArticle) throw new Error("Article not found");

    res.json(updatedArticle);
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
    if (isNaN(articleId)) throw new Error("ArticleId must be a number");

    const deletedArticle = await prisma.article.delete({
      where: { id: articleId },
    });

    if (!deletedArticle) throw new Error("Article not found");

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
