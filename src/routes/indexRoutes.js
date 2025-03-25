import express from "express";
import productRouter from "./productRoutes.js";
import articleRouter from "./articleRoutes.js";
import userRouter from "./userRoutes.js";
import commentRouter from "./commentRoutes.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/articles", articleRouter);
router.use("/", commentRouter);

export default router;
