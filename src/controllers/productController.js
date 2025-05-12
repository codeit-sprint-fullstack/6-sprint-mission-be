import { prisma } from "../db/prisma/client.prisma.js";
import productService from "../service/productService.js";

// 전체 상품 목록 조회
const getProducts = async (req, res, next) => {
  try {
    const { page, pageSize, orderBy, keyWord } = req.query;
    const userId = req.auth?.userId || null;

    const result = await productService.getProducts({
      page,
      pageSize,
      orderBy,
      keyWord,
      userId,
    });

    res.status(200).json({
      data: result.products,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

// 단일 상품 조회
const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.auth?.userId || null;
    const product = await productService.getProductById(productId, userId);

    res.status(200).json({ data: product });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
};

// TODO : 토큰확인 하는지 아래 컨트롤러들 확인하기

// 상품 생성
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const userId = req.auth.userId;

    const product = await productService.createProduct({
      name,
      description,
      price,
      tags,
      userId,
    });

    res.status(201).json({
      message: "상품이 성공적으로 등록되었습니다.",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 수정
const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const existingProduct = await productService.getProductById(productId);

    if (existingProduct.userId !== req.auth.userId) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const updatedProduct = await productService.updateProduct(
      productId,
      req.body
    );

    res.status(200).json({
      message: "상품이 성공적으로 수정되었습니다.",
      data: updatedProduct,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
};

// 상품 삭제
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const existingProduct = await productService.getProductById(productId);

    if (existingProduct.userId !== req.auth.userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await productService.deleteProduct(productId);

    res.status(200).json({
      message: "상품이 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

// 좋아요 누르기
const likeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.auth.userId;

    const liked = await prisma.$transaction([
      prisma.productLike.create({
        data: { userId, productId },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { likes: { increment: 1 } }, // 좋아요 수 +1
      }),
    ]);

    res.status(201).json({ message: "좋아요 완료", liked });
  } catch (err) {
    next(err);
  }
};

// 좋아요 취소
const unlikeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.auth.userId;

    await prisma.$transaction([
      prisma.productLike.delete({
        where: {
          userId_productId: { userId, productId },
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { likes: { decrement: 1 } }, // 좋아요 수 -1
      }),
    ]);

    res.status(200).json({ message: "좋아요 취소 완료" });
  } catch (err) {
    next(err);
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
};
