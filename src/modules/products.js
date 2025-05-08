import express from "express";
import { prisma } from "../db/prisma/client.prisma.js";
const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  console.log("asd");

  try {
    const {
      page = 0,
      pageSize = 10,
      orderBy = "recent",
      keyWord = "",
    } = req.query;

    const skip = Number(page) * Number(pageSize);
    const take = Number(pageSize);

    const where = keyWord
      ? {
          name: {
            contains: keyWord,
            mode: "insensitive",
          },
        }
      : {};

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: orderBy === "recent" ? "desc" : "asc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      data: products,
      pagination: {
        total,
        page: Number(page),
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });

    res.status(200).json({ data: product });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

productsRouter.post("/", async (req, res, next) => {
  try {
    const { name, description, price, tags = [] } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags,
        likes: 0,
      },
    });

    res.status(201).json({
      message: "상품이 성공적으로 등록되었습니다.",
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.patch("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.update({
      where: { id: productId },
      data: req.body,
    });

    res.status(200).json({
      message: "상품이 성공적으로 수정되었습니다.",
      data: product,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json({
      message: "상품이 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

export default productsRouter;
