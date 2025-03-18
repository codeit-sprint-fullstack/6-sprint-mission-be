import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Product from "./models/Product.js";
import * as dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

const app = express();
app.use(cors());
app.use(express.json());

// 상품 등록 API
app.post("/Products", async (req, res) => {
  try {
    const { name, description, price, tags, images } = req.body;
    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ message: "name, description, price는 필수 항목입니다." });
    }
    const product = new Product({ name, description, price, tags, images });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 등록 실패" });
  }
});

// 상품 상세 조회 API
app.get("/Products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 상세 조회 실패" });
  }
});

// 상품 수정 API (PATCH)
app.patch("/Products/:id", async (req, res) => {
  try {
    const { name, description, price, tags, images } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, tags, images },
      { new: true } // 업데이트된 데이터를 반환
    );
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 수정 실패" });
  }
});

// 상품 삭제 API
app.delete("/Products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json({ message: "상품 삭제 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 삭제 실패" });
  }
});

// 상품 목록 조회 API
app.get("/Products", async (req, res) => {
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const keyword = req.query.keyword || "";

  try {
    let sortOption = {};
    if (sort === "latest") {
      sortOption = { createdAt: -1 }; // 최신순 (내림차순)
    } else if (sort === "favorite") {
      sortOption = { favoriteCount: -1 }; // 좋아요순 (내림차순)
    } else {
      sortOption = { createdAt: -1 }; // 기본적으로 최신순 정렬
    }

    // 검색어 필터링 조건 (name, description, tags)
    const searchFilter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } }, // 'name' 필드에서 검색. 대소문자 무시
            { description: { $regex: keyword, $options: "i" } }, // 'description' 필드에서 검색. 대소문자 무시
            { tags: { $regex: keyword, $options: "i" } }, // 'tags' 필드에서 검색. 대소문자 무시
          ],
        }
      : {};

    const totalCount = await Product.countDocuments(searchFilter);
    const products = await Product.find(searchFilter) // 모든 데이터들을 조회
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    res.json({ list: products, totalCount }); // 전체 데이터를 응답
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
