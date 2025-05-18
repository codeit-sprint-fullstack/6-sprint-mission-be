import express from "express";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js"; // 이미 있을 경우
import commentRouter from "./comment.route.js";
import imageRouter from "./image.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes); // 추가로 남겨둠
router.use("/products", commentRouter);
router.use("/images", imageRouter); 

export default router;
