const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const errorHandler = require("../middleware/errorHandle.middleware");

const itemsRouter = express.Router();

itemsRouter.post("/", errorHandler, async (req, res, next) => {
  try {
    const data = req.body;
    const { name, description, price, tags } = data;
    const item = await prisma.item.create({
      data: { name, description, price, tags },
    });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

itemsRouter.get("/:itemId", errorHandler, async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!item) return res.status(404).send("can't find item");
    res.json(item);
  } catch (e) {
    next(e);
  }
});

itemsRouter.get("/", errorHandler, async (req, res, next) => {
  try {
    const skip = Number(req.query.page);
    const take = Number(req.query.pageSize);
    const search = req.query.keyword;
    const orderBy = req.query.orderBy;
    const options = {};
    if (orderBy === "recent") options.orderBy = { createdAt: "desc" };
    if (take) options.take = take;
    if (skip) options.skip = (skip - 1) * take;
    if (search)
      options.where = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      };

    const items = await prisma.item.findMany(options);
    res.json(items);
  } catch (e) {
    next(e);
  }
});

itemsRouter.patch("/:itemId", errorHandler, async (req, res, next) => {
  try {
    const data = req.body;
    const itemId = req.params.itemId;
    const updateItem = await prisma.item.update({
      where: { id: itemId },
      data,
    });
    if (!updateItem) return res.status(404).send("can't find item");
    res.status(204).json(updateItem);
  } catch (e) {
    next(e);
  }
});

itemsRouter.delete("/:itemId", errorHandler, async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const deleteItem = await prisma.item.delete({
      where: { id: itemId },
    });

    if (!deleteItem) return res.status(404).send("can't find item");
    res.status(204).json(deleteItem);
  } catch (e) {
    next(e);
  }
});

module.exports = itemsRouter;
