import { NextFunction, Request, Response } from "express";
import productService from "../service/productService";
import { NotFoundError } from "../types/commonError";
import { prisma } from "../db/prisma/client.prisma";
import { ProductParamsDto } from "../dtos/product.dto";
import { Express } from "express";

// 전체 상품 목록 조회
const getProducts = async (
  req: Request<
    {},
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
  req: Request<{ id: ProductParamsDto["id"] }>,
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

// 상품 생성
const createProduct = async (
  req: Request<
    {},
    {},
    {
      name?: string;
      description?: string;
      price?: number | string;
      tags?: string | string[];
      images?: string[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth!.userId;
    const { name, description, price, tags, images } = req.body;

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

    // 이미지는 이미 S3에 업로드되어 URL로 전달됨
    const imagePaths = images || [];

    const product = await productService.createProduct({
      name,
      description,
      price: Number(price),
      tags: processedTags || [],
      userId,
      images: imagePaths,
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
    { id: ProductParamsDto["id"] },
    {},
    {
      name?: string;
      description?: string;
      price?: number;
      images?: string[];
      tags?: string | string[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const { images, tags, ...otherData } = req.body;

    // 기존 상품 조회 (권한 확인 + 이미지 정보 필요)
    const existingProduct = await productService.getProductById(productId);

    if (existingProduct.userId !== req.auth!.userId) {
      res.status(403).json({ message: "수정 권한이 없습니다." });
      return;
    }

    // 기존 이미지 정보
    const oldImages = existingProduct.images || [];

    // 이미지는 이미 S3에 업로드되어 URL로 전달됨
    const newImages = images || [];

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

    // Prisma 모델에 맞는 데이터 구성
    const data = {
      ...otherData,
      ...(processedTags !== undefined && { tags: processedTags }),
      ...(newImages.length > 0 && { image: newImages }),
    };

    // DB 업데이트
    const updatedProduct = await productService.updateProduct(productId, data);

    // 🗑️ 사용하지 않는 기존 이미지들 S3에서 삭제 (비동기)
    const { findImagesToDelete, deleteS3Images } = await import(
      "../utils/s3Helper"
    );
    const imagesToDelete = findImagesToDelete(oldImages, newImages);

    if (imagesToDelete.length > 0) {
      // 비동기로 삭제 처리 (응답 속도에 영향 주지 않음)
      deleteS3Images(imagesToDelete).catch((error) => {
        console.error("상품 이미지 삭제 중 오류:", error);
      });
    }

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
  req: Request<{ id: ProductParamsDto["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;

    // 권한 확인 + 이미지 정보 조회
    const existingProduct = await productService.getProductById(productId);

    if (existingProduct.userId !== req.auth!.userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
    }

    const imagesToDelete = existingProduct.images || [];

    // DB에서 상품 삭제
    await productService.deleteProduct(productId);

    // 🗑️ 상품과 관련된 이미지들 S3에서 삭제 (비동기)
    if (imagesToDelete.length > 0) {
      const { deleteS3Images } = await import("../utils/s3Helper");
      deleteS3Images(imagesToDelete).catch((error) => {
        console.error("상품 삭제 후 이미지 삭제 중 오류:", error);
      });
    }

    res.status(200).json({
      message: "상품이 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

// 좋아요 누르기
const likeProduct = async (
  req: Request<{ productId: ProductParamsDto["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
    const userId = req.auth!.userId;

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
  req: Request<{ productId: ProductParamsDto["id"] }>,
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
