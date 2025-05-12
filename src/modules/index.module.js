import express from "express";
import articlesRouter from "./articles.module.js";
import authRouter from "./auth.module.js";
import productRouter from "./product.module.js"; 

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter); 

export default router;
