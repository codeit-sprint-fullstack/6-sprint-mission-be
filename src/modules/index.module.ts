// src/routes/index.ts 또는 mainRouter.ts
import express from "express";
import authRouter from "../routes/auth.route";
import productRouter from "../routes/product.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter); 

export default router;
