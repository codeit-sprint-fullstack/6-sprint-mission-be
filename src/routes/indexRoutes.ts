import express from "express";
import productRouter from "./productRoutes";
import articleRouter from "./articleRoutes";
import userRouter from "./userRoutes";
import articleCommentRouter from "./articleCommentRouter";
import productCommentRouter from "./productCommentRoutes";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/products", productRouter);
router.use("/products", productCommentRouter);
router.use("/articles", articleRouter);
router.use("/articles", articleCommentRouter);

export default router;
