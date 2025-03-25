/********************************
 * 상품 관련 댓글 코드입니다
 ********************************/
const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const productCommentsRouter = express.Router();

/**
 * 댓글 등록
 */
productCommentsRouter.post("/:productId/comment", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId) throw new Error("존재하지 않는 상품입니다");

    const { content } = req.body;

    const comment = await prisma.productComment.create({
      data: { content, productId },
    });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 목록 조회
 */
productCommentsRouter.get("/:productId/comments", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId) return res.json("존재하지 않는 상품입니다");

    const comments = await prisma.productComment.findMany({
      where: { productId },
    });
    if (comments.length === 0)
      res.json("해당 상품에는 댓글이 존재하지 않습니다.");

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정
 */
productCommentsRouter.patch("/comment/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    if (!commentId)
      throw new Error("해당 게시글엔 존재하지 않는 댓글입니다...");

    const { content } = req.body;

    const comment = await prisma.productComment.update({
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
productCommentsRouter.delete("/comment/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    const existingComment = await prisma.productComment.findUnique({
      where: { id: commentId },
    });
    if (!existingComment)
      return res.status(404).json("존재하지 않는 댓글은 삭제할 수 없습니다..");

    await prisma.productComment.delete({ where: { id: commentId } });

    res.status(200).json("댓글이 삭제되었습니다.");
  } catch (e) {
    next(e);
  }
});

module.exports = productCommentsRouter;
