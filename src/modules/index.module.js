const express = require("express");
const productsRouter = require("./products.module");

const router = express.Router();

router.use("/products", productsRouter);

module.exports = router;
