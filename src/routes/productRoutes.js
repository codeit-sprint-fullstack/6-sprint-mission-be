import express from "express";

const productRouter = express.Router();

// 상품 목록조회
productRouter.get("/", async (req, res, next) => {
  try {
    const { offset, limit, orderBy, keyword } = req.query;
    // find
    const regex = { $regex: keyword ? keyword : "", $options: "i" };
    const selectFields = { id: 1, name: 1, price: 1, like: 1, createdAt: 1 };

    // sort
    const sort = { createdAt: orderBy === "recent" ? -1 : 1 };

    // skip
    const skip = (Number(offset) - 1) * Number(limit) || 0;

    // limit
    const pageSize = Number(limit) || 10;

    const filter = { $or: [{ name: regex }, { description: regex }] };

    // const products = await Product.find(filter, selectFields)
    // .sort(sort)
    // .skip(skip)
    // .limit(pageSize);
    // const totalCount = await Product.countDocuments(filter);

    res.json("ok");
  } catch (e) {
    next(e);
  }
});

// 상품 상세조회
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const selectFields = "id name description price tags createdAt";
    // const product = await Product.findById(productId).select(selectFields);

    res.json("ok");
  } catch (e) {
    next(e);
  }
});

// 상품 등록
productRouter.post("/", async (req, res, next) => {
  try {
    // const product = await Product.create(req.body);

    res.status(201).json("ok");
  } catch (e) {
    next(e);
  }
});

// 상품 수정
productRouter.patch("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    // const product = await Product.findById(productId);

    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    await product.save();

    res.status(200).json("ok");
  } catch (e) {
    next(e);
  }
});

// 상품 삭제
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    // await Product.findByIdAndDelete(productId);

    res.send("ok");
  } catch (e) {
    next(e);
  }
});

export default productRouter;
