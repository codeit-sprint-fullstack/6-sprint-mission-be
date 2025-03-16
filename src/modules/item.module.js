const express = require("express");
const Items = require("../models/Items.js");
const itemsRouter = express.Router();

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req.res);
    } catch (e) {
      switch (e.name) {
        case "ValidationError":
          res.status(400).send({ message: e.message });
          break;
        case "CastError":
          res.status(404).send({ message: "Cannot find given id" });
          break;
        default:
          res.status(500).send({ message: e.message });
          break;
      }
    }
  };
};

itemsRouter.get("/", async (req, res, next) => {
  try {
    const items = await Items.find();

    res.json(items);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

itemsRouter.get("/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);

    res.json(item);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

itemsRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const result = await Items.create(data);
    console.log(result);
    res.status(201).send("created");
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
    res.status(204).send("no content");
  } catch (e) {
    next(e);
  }
});

itemsRouter.delete("/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const deleteItem = await Items.findByIdAndDelete(itemId);

    if (!deleteItem) return res.status(404).send("can't find item");

    res.status(204).send("no content");
  } catch (e) {
    next(e);
  }
});

module.exports = itemsRouter;
