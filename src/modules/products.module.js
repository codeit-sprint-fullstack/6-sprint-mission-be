const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const productsRouter = express.Router();

/**
 * 상품 등록
 */
productsRouter.post("/", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });

    res.json(product);
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
      omit: { updatedAt: true },
    });

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

    await prisma.product.update({
      where: { id: productId },
      data: { name, description, price, tags },
    });
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

    await prisma.product.delete({ where: { id: productId } });
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

    res.json(products);
  } catch (e) {
    next(e);
  }
});

module.exports = productsRouter;
