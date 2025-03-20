const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articlesRouter = express.Router();

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

articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (articleId === NaN) throw new Error("ArticleId must be number");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article) throw new Error("No article found");
    res.json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 목록 조회
articlesRouter.get("/", async (req, res, next) => {
  try {
    const skip = Number(req.query.offset);
    const search = req.query.search;
    const options = {};

    //정렬
    options.orderBy = { createdAt: "desc" };

    //오프셋
    if (skip) options.skip = skip;

    //검색
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
//게시글 수정
articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (isNaN(articleId))
      return res.status(400).json({ error: "Invalid articleId" });

    const { title, content } = req.body;
    if (!title && content) {
      return res.status(400).json({ error: "최소하나는 필요" });
    }

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!existingArticle) {
      return res.status(404).json({ error: "아티클없음" });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });
    res.json(updatedArticle);
  } catch (e) {
    next(e);
  }
});
//게시글 삭제
articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (isNaN(articleId)) {
      return res.status(400).json({ error: "Article must be number" });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return res.status(400).json({ error: "No article found" });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });
    res.status(200).json({ message: "Article deleted successfully!" });
  } catch (e) {
    next(e);
  }
});

//댓글 작성
articlesRouter.post("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (isNaN(articleId)) {
      return res.status(400).json({ error: "ArticleId must be number" });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return res.status(404).json({ error: "No article found" });
    }
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
      },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});
module.exports = articlesRouter;
