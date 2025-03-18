const express = require("express");
const Items = require("../models/Items.js");
const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res, next) => {
  try {
    const {
      page = 0,
      pageSize = null,
      orderBy = "recent",
      keyWord = "",
    } = req.query;

    const sortOption = {
      createdAt: orderBy === "recent" ? "desc" : "asc",
    };
    const searchOption = keyWord
      ? {
          $or: [
            { name: { $regex: keyWord, $options: "i" } },
            { description: { $regex: keyWord, $options: "i" } },
          ],
        }
      : {};
    const items = await Items.find(searchOption)
      .limit(pageSize)
      .skip(page * pageSize)
      .sort(sortOption);
    const totalCount = await Items.countDocuments(searchOption);
    res.json({ items, totalCount });
  } catch (e) {
    next(e);
  }
});

itemsRouter.get("/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) return res.status(404).send("can't find item");
    res.json(item);
  } catch (e) {
    next(e);
  }
});

itemsRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const item = await Items.create(data);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

itemsRouter.patch("/:id", async (req, res, next) => {
  try {
    const data = req.body;
    const itemId = req.params.id;
    const updateItem = await Items.findByIdAndUpdate(itemId, data, {
      new: true,
    });
    if (!updateItem) return res.status(404).send("can't find item");
    res.status(204).json(updateItem);
  } catch (e) {
    next(e);
  }
});

itemsRouter.delete("/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const deleteItem = await Items.findByIdAndDelete(itemId);

    if (!deleteItem) return res.status(404).send("can't find item");

    res.status(204).json(deleteItem);
  } catch (e) {
    next(e);
  }
});

module.exports = itemsRouter;
