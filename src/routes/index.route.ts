import express, { Request, Response } from "express";
import usersRouter from "./users.route";
import articlesRouter from "./articles.route";
import productsRouter from "./products.route";
import commentsRouter from "./comments.route";
import authRouter from "./auth.route";

const indexRouter = express.Router();

// API 경로 설정
indexRouter.use("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});
indexRouter.use("/auth", authRouter);
indexRouter.use("/user", usersRouter);
indexRouter.use("/products", productsRouter);
indexRouter.use("/articles", articlesRouter);
indexRouter.use("", commentsRouter);

export default indexRouter;
