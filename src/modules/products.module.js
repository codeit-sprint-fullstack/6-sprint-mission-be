const express = require("express");
const prisma = require("../db/client.prisma");

const productsRouter = express.Router();

/**
 * 상품 등록
 */

productsRouter.post("/", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags)
      throw new Error("필수 정보가 누락");

    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });

    res.json(product);
  } catch (e) {
    next(e);
  }
});

/**
 * 상품 목록 조회
 */

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    if (!products) throw new Error("등록된 상품이 없습니다...");
    res.json(products);
  } catch (e) {
    next(e);
  }
});

/**
 * 상품 상세 조회
 */

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.json("그런 상품은 없습니다...");
    res.json(product);
  } catch (e) {
    next(e);
  }
});

/**
 * 상품 수정
 */

productsRouter.patch("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { name, description, price, tags } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct)
      return res.status(404).json("존재하지 않는 상품입니다.");

    const product = await prisma.product.update({
      where: { id: productId },
      data: { name, description, price, tags },
    });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

/**
 * 상품 삭제
 */

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct)
      return res.status(404).json("존재하지 않는 상품입니다");

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json("상품이 삭제되었습니다.");
  } catch (e) {
    next(e);
  }
});

module.exports = productsRouter;
