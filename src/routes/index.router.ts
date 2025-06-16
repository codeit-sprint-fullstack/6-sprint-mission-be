import express from "express";
import productRouter from "./product.router";
import articleRouter from "./article.router";
import userRouter from "./user.router";
import articleCommentRouter from "./articleComment.router";
import productCommentRouter from "./productComment.router";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/products", productRouter);
router.use("/products", productCommentRouter);
router.use("/articles", articleRouter);
router.use("/articles", articleCommentRouter);

export default router;
