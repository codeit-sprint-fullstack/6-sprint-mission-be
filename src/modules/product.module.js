import express from "express";
import prisma from "../db/prisma/client.prisma.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";

const productRouter = express.Router();

// 상품 생성 
productRouter.post(
  "/",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, tags, favorite } = req.body;
      const { userId } = req;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          tags: tags ? tags.split(",") : [],
          favorite: favorite ? parseInt(favorite) : 0,
          image,
          user: {
            connect: { id: userId },
          },
        },
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("🔥 Error while creating product:", error);
      res.status(500).json({ message: "서버 오류", error: error.message });
    }
  }
);

// 전체 상품 목록 조회
productRouter.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 특정 상품 조회
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 상품 수정
productRouter.patch("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const { userId } = req;

  try {
    // 상품 조회
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) return res.status(404).json({ message: "상품 없음" });
    if (product.userId !== userId)
      return res.status(403).json({ message: "권한 없음" });

    // 수정할 데이터를 담을 객체
    const dataToUpdate = {};

    if (name) dataToUpdate.name = name;
    if (description) dataToUpdate.description = description;
    if (price) dataToUpdate.price = price;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: "수정할 데이터가 없습니다." });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json(updatedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 상품 삭제
productRouter.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    // 해당 상품을 데이터베이스에서 찾기
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nickname: true },
    });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default productRouter;
