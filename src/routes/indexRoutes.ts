import express from "express";
import productRouter from "./productRoutes";
import articleRouter from "./articleRoutes";
import userRouter from "./userRoutes";
import commentRouter from "./commentRoutes";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/products", productRouter);
router.use("/articles", articleRouter);
router.use("/", commentRouter);

export default router;
