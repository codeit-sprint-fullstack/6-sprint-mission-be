const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const commentsRouter = express.Router();

/**
 * 댓글 등록
 */
commentsRouter.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) throw new Error("댓글을 작성해주세요");

    const comment = await prisma.comment.create({ data: { content } });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정
 */
commentsRouter.patch("/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    if (!commentId)
      return res.status(404).json({ message: "존재하지 않는 댓글입니다..." });

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 삭제
 */
commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment)
      return res.status(404).json("존재하지 않는 댓글입니다..");

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json("댓글이 삭제되었습니다.");
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
