import express from "express";
import usersRouter from "./users.route.js";
import articlesRouter from "./articles.route.js";
import productsRouter from "./products.route.js";
import commentsRouter from "./comments.route.js";
import authRouter from "./auth.route.js";

const indexRouter = express.Router();

// API 경로 설정
indexRouter.use("/auth", authRouter);
indexRouter.use("/user", usersRouter);
indexRouter.use("/products", productsRouter);
indexRouter.use("/articles", articlesRouter);
indexRouter.use("", commentsRouter);

export default indexRouter;
