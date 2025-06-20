const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const itemCommentsRouter = express.Router();

itemCommentsRouter.post("/:itemId", async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const data = req.body;
    const { content } = data;
    const comment = await prisma.comment.create({ data: { content, itemId } });
    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

itemCommentsRouter.get("/:itemId", async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const { cursor, limit = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { itemId },
      take: Number(limit),
      skip: cursor ? 1 : 0,
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    if (!comments) throw new Error("No comment found");
    const nextCursor = comments[comments.length - 1].id;
    res.json({ comments, nextCursor });
  } catch (e) {
    next(e);
  }
});

module.exports = itemCommentsRouter;
