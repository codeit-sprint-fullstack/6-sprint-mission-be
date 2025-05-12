import express from "express";
import usersRouter from "./users.route.js";
import articlesRouter from "./articles.route.js";
import productsRouter from "./products.route.js";
import commentsRouter from "./comments.route.js";

const indexRouter = express.Router();

// API 경로 설정
indexRouter.use("/api/users", usersRouter);
indexRouter.use("/api/products", productsRouter);
indexRouter.use("/api/articles", articlesRouter);
indexRouter.use("/api/comments", commentsRouter);

export default indexRouter;
