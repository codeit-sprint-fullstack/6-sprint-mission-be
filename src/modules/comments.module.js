const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const articleCommentsRouter = require("./articleComments.module");
const itemCommentsRouter = require("./itemComments.module");
const errorHandler = require("../middleware/errorHandle.middleware");

const commentsRouter = express.Router();

commentsRouter.use("/articles", articleCommentsRouter);
commentsRouter.use("/items", itemCommentsRouter);

commentsRouter.patch("/:commentId", errorHandler, async (req, res, next) => {
  try {
    const data = req.body;
    const commentId = req.params.commentId;
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data,
    });
    if (!updatedComment) return res.status(404).send("can't find comment");
    res.status(204).json(updatedComment);
  } catch (e) {
    next(e);
  }
});

commentsRouter.delete("/:commentId", errorHandler, async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    if (!deletedComment) return res.status(404).send("can't find comment");
    res.status(204).json(deletedComment);
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
