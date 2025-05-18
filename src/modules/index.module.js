import express from "express";
import articlesRouter from "./articles.module.js";
import authRouter from "./auth.module.js";
import productRouter from "./product.module.js"; 
import favoriteRouter from "../routes/favorite.routes.js";

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter); 
router.use("/favorites", favoriteRouter);

export default router;
