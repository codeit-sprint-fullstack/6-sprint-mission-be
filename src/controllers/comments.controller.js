const express = require("express");
const prisma = require("../config/prismaClient");

const commentsRouter = express.Router();

// 자유게시판 댓글 등록
commentsRouter.post("/articles/:articleId", async (req, res, next) => {
  const articleId = Number(req.params.articleId);
  const content = req.body.content;

  // 게시글이 있어야 함
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article)
    return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });

  // 댓글 내용이 있어야 함
  if (!content) {
    return res.status(400).json({ message: "댓글을 입력해 주세요." });
  }

  try {
    const comment = await prisma.comment.create({
      data: { content, article: { connect: { id: articleId } } },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

// 자유게시판 댓글 목록 조회 및 검색 -- 수정할 것임
commentsRouter.get("/articles/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { cursor, limit = 10 } = req.query;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) return res.status(404).json({ message: "게시물이 없습니다" });

    // 최대 개수 설정 (30개)
    const commentsLimit = Math.min(Number(limit), 30);

    // 댓글 조회 (커서 포함)
    const articleComments = await prisma.comment.findMany({
      where: { articleId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: "asc",
      },
      take: commentsLimit + 1,
      cursor: cursor ? { id: Number(cursor) } : undefined,
    });

    // 페이지 넘기기(커서)
    const hasNextPage = articleComments.length > commentsLimit;
    const nextCursor = hasNextPage ? articleComments[commentsLimit].id : null;

    res.status(201).json({
      message: `${articleId}번 게시글의 댓글 목록`,
      comments: hasNextPage
        ? articleComments.slice(0, commentsLimit)
        : articleComments,
      nextCursor,
    });
  } catch (e) {
    console.error("댓글 오류", e);
    next(e);
  }
});

// 댓글 수정 - 일단 자유게시판만
commentsRouter.patch("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const content = req.body.content;

    if (!commentId) {
      return res.status(404).json({ message: "해당 게시글이 없습니다." });
    }

    const updateComment = await prisma.articleComment.update({
      where: { id: commentId },
      data: { content: content },
    });

    res.json(updateComment);
  } catch (e) {
    next(e);
  }
});

// 댓글 삭제 - 일단 자유게시판만22
commentsRouter.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    await prisma.articleComment.delete({ where: { id: commentId } });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
