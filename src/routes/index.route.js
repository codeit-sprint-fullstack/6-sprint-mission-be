import express from "express";
import usersRouter from "./users.route.js";
import articlesRouter from "./articles.route.js";
import productsRouter from "./products.route.js";

const indexRouter = express.Router();

indexRouter.use("", usersRouter);
indexRouter.use("/products", productsRouter);
indexRouter.use("/articles", articlesRouter);

export default indexRouter;
