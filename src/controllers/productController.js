import express from "express";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";

const productController = express.Router();

// 상품 등록 api
productController.post("/", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    // price 검사
    const price = Number(req.body.price);
    if (isNaN(price)) {
      return res.status(400).json({ message: "가격은 숫자여야 합니다." });
    }

    // tags 검사
    let tags = [];
    const rawTags = req.body.tags;

    if (Array.isArray(rawTags)) {
      tags = rawTags;
    } else if (typeof rawTags === "string") {
      try {
        tags = JSON.parse(rawTags);
      } catch (e) {
        console.error("태그 파싱 오류:", rawTags);
        return res.status(400).json({ message: "태그 형식 오류" });
      }
    } else if (rawTags === undefined) {
      tags = [];
    } else {
      return res.status(400).json({ message: "태그 형식 오류" });
    }

    // images 검사
    let images = [];
    const rawImages = req.body.images;

    if (Array.isArray(rawImages)) {
      images = rawImages;
    } else if (typeof rawImages === "string") {
      try {
        images = JSON.parse(rawImages);
      } catch (e) {
        console.error("이미지 파싱 오류:", rawImages);
        return res.status(400).json({ message: "이미지 형식 오류" });
      }
    } else if (rawImages === undefined) {
      images = [];
    } else {
      return res.status(400).json({ message: "이미지 형식 오류" });
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price,
      tags,
      images,
    };

    const newProduct = await productService.createProduct(productData, userId);

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// 상품 목록 조회 API
productController.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const orderBy = req.query.orderBy === "favorite" ? "favorite" : "recent";

    const { list, totalCount } = await productService.getAllProducts({
      page,
      pageSize,
      orderBy,
    });

    const formatted = list.map((p) => ({
      ...p,
      price: p.price.toLocaleString("ko-KR"),
    }));

    res.json({ list: formatted, totalCount });
  } catch (err) {
    next(err);
  }
});

// 상품 상세 조회 api
productController.get(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const product = await productService.getProductById(
        Number(req.params.id),
        req.auth.userId // 좋아요(isFavorite)에 의해 유저 id 전달
      );
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

// 상품 삭제 API
productController.delete(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const deleted = await productService.deleteProduct(Number(req.params.id));
      res.json(deleted);
    } catch (err) {
      next(err);
    }
  }
);

// 상품 수정 API
productController.patch(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const userId = req.auth.userId;

      // // 1. 새로 업로드된 이미지 경로
      // const newImagePaths = req.files.map(
      //   (file) => `/uploads/${file.filename}`
      // );

      // 2. 기존 이미지들 (string 또는 array로 올 수 있음)
      const existing = req.body.existingImages;
      const existingImagePaths =
        typeof existing === "string"
          ? [existing] // 단일 문자열인 경우
          : Array.isArray(existing)
          ? existing
          : []; // 없으면 빈 배열

      // 3. 최종 이미지 배열
      const finalImagePaths = [...existingImagePaths, ...newImagePaths];

      const updated = await productService.updateProduct(id, {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        tags: JSON.parse(req.body.tags),
        images: finalImagePaths, // 새 + 기존 이미지
        ownerId: userId,
      });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

export default productController;
