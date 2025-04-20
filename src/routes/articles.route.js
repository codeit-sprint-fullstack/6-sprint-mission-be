const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articlesRouter = express.Router();

/**
 * 게시글 등록
 **/
articlesRouter.post("/", async (req, res, next) => {
  try {
    const { title, content, thumbnailImg, userId } = req.body;

    // 로그인 여부 확인
    if (!userId) {
      return res.status(401).json({
        message: "글을 작성하려면 먼저 로그인해야 합니다.",
      });
    }

    // 로그인 제대로 되었나 확인
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    // 글 작성 시 필수 항목 확인
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "글의 제목과 내용을 입력하세요." });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        thumbnailImg,
        user: { connect: { id: userId } },
      },
      include: { user: true },
    });

    res.status(201).json(article);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

/**
 * 게시글 조회
 */
articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (isNaN(articleId)) {
      return res
        .status(400)
        .json({ message: "게시글 ID가 유효하지 않습니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: { nickname: true },
        },
        likesToArticle: {
          select: { id: true },
        },
      },
    });

    if (!article)
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });

    res.json({ article });
  } catch (e) {
    next(e);
  }
});

/**
 * 게시글 목록 조회 및 검색
 **/
articlesRouter.get("/", async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const { search, sort } = req.query;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    // 정렬
    const orderBy =
      sort === "likes"
        ? { likesToArticle: { _count: "desc" } }
        : { createdAt: "desc" };

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          thumbnailImg: true,
          user: { select: { nickname: true } },
          likesToArticle: { select: { id: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({ articles, totalCount });
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
    const { title, content, thumbnailImg } = req.body;

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content, thumbnailImg },
    });

    if (!articleId)
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });

    res.status(200).json(updatedArticle);
  } catch (e) {
    next(e);
  }
});

// 게시글 삭제
articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article)
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

    await prisma.article.delete({ where: { id: articleId } });

    res.sendStatus(204).json({ message: "게시글이 삭제되었습니다." });
  } catch (e) {
    next(e);
  }
});

module.exports = articlesRouter;
