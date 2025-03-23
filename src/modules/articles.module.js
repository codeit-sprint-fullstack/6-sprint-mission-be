const express = require("express");
const articlesRouter = express.Router();

articlesRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    console.log("data", data);
    res.send("Ok");
  } catch (e) {
    next(e);
  }
});
module.exports = articlesRouter;
