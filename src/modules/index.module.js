const express = require("express");
const itemsRouter = require("./item.module");

const router = express.Router();

router.use("/items", itemsRouter);

module.exports = router;
