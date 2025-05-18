import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createProduct } from "../modules/product.module.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; 
    const product = await createProduct({ ...req.body, userId }); 
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "상품 등록 실패" });
  }
});

export default router;
