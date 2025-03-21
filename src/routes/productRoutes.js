import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const productRouter = express.Router();

// 상품 목록 불러오기
productRouter.get("/", async (req, res, next) => {
  try {
    const { offset, limit, orderBy, keyword } = req.query;
    const filter = {
      OR: [
        { name: { contains: keyword || "", mode: "insensitive" } },
        { description: { contains: keyword || "", mode: "insensitive" } },
      ],
    };

    await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: filter,
        skip: (Number(offset) - 1) * Number(limit) || 0,
        take: Number(limit) || 10,
        orderBy: { createdAt: orderBy === "recent" ? "desc" : "asc" },
        omit: { description: true, updatedAt: true },
      });

      const totalCount = await tx.product.count({ where: filter });

      res.json({ list: products, totalCount });
    });
  } catch (e) {
    next(e);
  }
});

// 상품 상세조회
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        omit: { updatedAt: true },
      });
      if (!product) throw new Error("상품을 찾을 수 없습니다.");

      const productTag = await tx.productTag.findMany({
        where: { productId },
        include: { tag: true },
      });

      const tags = productTag.map((tag) => tag.tag.name);

      res.json({ ...product, tags });
    });
  } catch (e) {
    next(e);
  }
});

// 상품 등록
productRouter.post("/", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    if (10 < name.length) throw new Error("10글자 이내로 입력해주세요.");
    if (10 > description.length || 100 < description.length)
      throw new Error("10 ~ 100글자 이내로 입력해주세요.");
    tags.map((tag) => {
      if (Boolean(5 < tag.length))
        throw new Error("5글자 이내로 입력해주세요.");
    });

    await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: { name, description, price },
      });

      const newTags = await Promise.all(
        tags.map(async (tagName) => {
          let tag = await tx.tag.findUnique({ where: { name: tagName } });
          if (!tag) tag = await tx.tag.create({ data: { name: tagName } });

          await tx.productTag.create({
            data: { productId: newProduct.id, tagId: tag.id },
          });
          return tag.name;
        })
      );

      res.status(201).json({ ...newProduct, tags: newTags });
    });
  } catch (e) {
    next(e);
  }
});

// 상품 수정
productRouter.patch("/:productId", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const productId = Number(req.params.productId);
    if (!(name || description || price || tags))
      throw new Error("수정할 내용을 입력해주세요.");

    await prisma.$transaction(async (tx) => {
      const updateProduct = await tx.product.update({
        where: { id: productId },
        data: { name, description, price },
      });

      await tx.productTag.deleteMany({ where: { productId } });

      const updateTags = await Promise.all(
        tags.map(async (tagName) => {
          let tag = await tx.tag.findUnique({ where: { name: tagName } });
          if (!tag) tag = await tx.tag.create({ data: { name: tagName } });
          await tx.productTag.create({ data: { productId, tagId: tag.id } });
          return tag.name;
        })
      );

      res.status(200).json({ ...updateProduct, tags: updateTags });
    });
  } catch (e) {
    next(e);
  }
});

// 상품 삭제
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("이미 삭제된 상품입니다.");

      await tx.product.delete({ where: { id: productId } });

      res.sendStatus(204);
    });
  } catch (e) {
    next(e);
  }
});

export default productRouter;
