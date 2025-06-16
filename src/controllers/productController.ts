import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../db/prisma/client.prisma";
import productService from "../service/productService";
import { Product } from "@prisma/client";
import { NotFoundError } from "../types/commonError";

// 전체 상품 목록 조회
const getProducts = async (
  req: Request<
    {
      id: Product["id"];
    },
    {},
    {},
    {
      page?: number;
      pageSize?: number;
      orderBy?: string;
      keyWord?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.userId;
    const { page, pageSize, orderBy, keyWord } = req.query;

    const result = await productService.getProducts({
      page,
      pageSize,
      orderBy,
      keyWord,
      userId,
    });

    res.status(200).json({
      products: result.products,
      pagination: result.pagination,
      sort: result.sort,
    });
  } catch (err) {
    next(err);
  }
};

// 단일 상품 조회
const getProductById = async (
  req: Request<{ id: Product["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const userId = req.auth?.userId;
    const product = await productService.getProductById(productId, userId);

    res.status(200).json(product);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
      return;
    }
    next(err);
  }
};

// TODO : 토큰확인 하는지 아래 컨트롤러들 확인하기

// 상품 생성
const createProduct = async (
  req: Request<
    { id: Product["id"] },
    {},
    {
      name?: string;
      description?: string;
      price?: number | string;
      tags?: string | string[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth!.userId;
    const { name, description, price, tags } = req.body;

    // tags 데이터 처리: 문자열로 전송된 경우 배열로 변환
    let processedTags: string[] = Array.isArray(tags) ? tags : [];
    if (typeof tags === "string") {
      try {
        // JSON 문자열로 전송된 경우 파싱
        if (tags.startsWith("[") && tags.endsWith("]")) {
          processedTags = JSON.parse(tags);
        } else {
          // 쉼표로 구분된 문자열인 경우
          processedTags = tags.split(",").map((tag) => tag.trim());
        }
      } catch (e) {
        // 파싱 실패 시 빈 배열로 설정
        processedTags = [];
      }
    }

    // 여러 이미지 파일 처리
    const imagePaths =
      req.files && Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    const product = await productService.createProduct({
      name,
      description,
      price: Number(price),
      tags: processedTags || [],
      userId,
      image: imagePaths,
    });

    res.status(201).json({
      message: "상품이 성공적으로 등록되었습니다.",
      product,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 수정
const updateProduct = async (
  req: Request<
    { id: Product["id"] },
    {},
    {
      name?: string;
      description?: string;
      price?: number;
      existingImages?: string;
      tags?: string | string[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const { existingImages, tags, ...otherData } = req.body;

    // 여러 이미지 파일 처리
    const newImagePaths =
      req.files && Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    // 기존 이미지 처리: 문자열로 전송된 경우 배열로 변환
    let existingImagePaths = [];
    if (existingImages) {
      try {
        existingImagePaths =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
      } catch (e) {
        existingImagePaths = [];
      }
    }

    // 새 이미지와 기존 이미지 병합
    const finalImagePaths = [...existingImagePaths, ...newImagePaths];

    // tags 데이터 처리: 문자열로 전송된 경우 배열로 변환
    let processedTags: string[] = Array.isArray(tags) ? tags : [];
    if (typeof tags === "string") {
      try {
        // JSON 문자열로 전송된 경우 파싱
        if (tags.startsWith("[") && tags.endsWith("]")) {
          processedTags = JSON.parse(tags);
        } else {
          // 쉼표로 구분된 문자열인 경우
          processedTags = tags.split(",").map((tag) => tag.trim());
        }
      } catch (e) {
        // 파싱 실패 시 기존 태그 유지
        processedTags = [];
      }
    }

    const existingProduct = await productService.getProductById(productId);

    if (existingProduct.userId !== req.auth!.userId) {
      res.status(403).json({ message: "수정 권한이 없습니다." });
      return;
    }

    // Prisma 모델에 맞는 데이터 구성
    const data = {
      ...otherData,
      ...(processedTags !== undefined && { tags: processedTags }),
      ...(finalImagePaths.length > 0 && { image: finalImagePaths }),
    };

    const updatedProduct = await productService.updateProduct(productId, data);

    res.status(200).json({
      message: "상품이 성공적으로 수정되었습니다.",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Update error:", err);
    if (err instanceof NotFoundError) {
      res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
      return;
    }
    next(err);
  }
};

// 상품 삭제
const deleteProduct = async (
  req: Request<{ id: Product["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;

    const existingProduct = await productService.getProductById(productId);

    if (existingProduct.userId !== req.auth!.userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
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
const likeProduct = async (
  req: Request<{ productId: Product["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
    const userId = req.auth!.userId;

    console.log("userId", userId);
    console.log("productId", productId);

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
const unlikeProduct = async (
  req: Request<{ productId: Product["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
    const userId = req.auth!.userId;

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
