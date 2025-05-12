import express from "express";
import usersRouter from "./users.route.js";
import articlesRouter from "./articles.route.js";
import productsRouter from "./products.route.js";
import commentsRouter from "./comments.route.js";

const indexRouter = express.Router();

// API 경로 설정
indexRouter.use("", usersRouter);
indexRouter.use("/products", productsRouter);
indexRouter.use("/articles", articlesRouter);
indexRouter.use("", commentsRouter);

export default indexRouter;
