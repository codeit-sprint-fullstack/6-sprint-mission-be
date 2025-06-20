import express, { Router } from "express";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js";
import commentRouter from "./comment.route.js";
import imageRouter from "./image.route.js";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/products", commentRouter);
router.use("/images", imageRouter);

export default router; 