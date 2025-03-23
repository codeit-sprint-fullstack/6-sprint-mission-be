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
    if (isNaN(articleId))
      throw new Error("조회하려는 게시글 id는 숫자여야 합니다");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!article) throw new Error("게시물이 존재하지 않습니다");
    res.json(article);
  } catch (e) {
    next(e);
  }
});

// get article list
articlesRouter.get("/", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 5, sort = "recent", search = "" } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    // for offset pagination
    const skip = (pageNum - 1) * pageSizeNum;

    // where var detail for search in db
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};

    // retrieving list of articles
    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      skip,
      take: pageSizeNum,
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
    });

    // total count for pagination
    const totalCount = await prisma.article.count({ where });

    res.json({
      data: articles,
      meta: {
        total: totalCount,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages: Math.ceil(totalCount / pageSizeNum),
      },
    });
  } catch (e) {
    next(e);
  }
});

// update article
articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (isNaN(articleId))
      throw new Error("조회하려는 게시글 id는 숫자여야 합니다");

    // assign values from requested body
    const { title, content } = req.body;

    // validation check
    if (!title && !content) {
      throw new Error("게시글 제목이나 내용이 새로 수정되어야 합니다");
    }

    // new data
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    res.json(updatedArticle);
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
