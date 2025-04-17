const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const commentsRouter = require("./comments.module");

const productsRouter = express.Router();

productsRouter.use("/:productId/comments", commentsRouter);

/**
 * 상품 등록
 */
productsRouter.post("/", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price)
      throw new Error("상품 정보를 모두 입력해주세요.");

    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });

    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

/**
 * 상품 조회
 */
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    if (isNaN(productId)) throw new Error("상품 Id는 숫자여야 합니다.");

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });
    if (!product) throw new Error("상품을 찾을 수 없습니다.");

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

    if (isNaN(productId)) throw new Error("상품 Id는 숫자여야 합니다.");

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
    if (!productId) throw new Error("상품을 찾을 수 없습니다.");

    await prisma.product.delete({ where: { id: productId } });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

/**
 * 상품 목록 조회
 */
productsRouter.get("/", async (req, res, next) => {
  try {
    const offset = Number(req.query.offset);
    const search = req.query.search;

    const options = {};

    options.orderBy = { createdAt: "desc" };

    if (offset) options.skip = offset;

    if (search)
      options.where = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      };

    const products = await prisma.product.findMany(options);

    res.json(products);
  } catch (e) {
    next(e);
  }
});

module.exports = productsRouter;
