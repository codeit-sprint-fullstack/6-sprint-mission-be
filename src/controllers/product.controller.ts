import { Request, Response, RequestHandler } from "express";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";
import { CreateProductDTO } from "../dtos/product.dto.js";

interface AuthRequest extends Request {
  userId?: number;
}

// 상품 생성
export const createProductController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    return;
  }

  try {
    const { name, description, price, tags } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const dto: CreateProductDTO = {
      name,
      description,
      price: parseFloat(price),
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",")
        : [],
      image,
      userId,
    };

    const product = await createProductService(dto);
    res.status(201).json(product);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 상품 전체 조회
export const getAllProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 특정 상품 조회
export const getProductByIdController: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { id } = req.params;
  // userId가 있을 수도 있고 없을 수도 있으므로 optional
  const userId = (req as AuthRequest).userId;

  try {
    const product = await getProductByIdService(Number(id), userId);
    if (!product) {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("상품 상세 조회 에러:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 상품 수정
export const updateProductController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    return;
  }

  const { name, description, price } = req.body;

  try {
    const updatedProduct = await updateProductService(Number(id), userId, {
      name,
      description,
      price: price !== undefined ? parseFloat(price) : undefined,
    });

    res.json(updatedProduct);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ message: "상품 없음" });
      return;
    }

    if (error.message === "FORBIDDEN") {
      res.status(403).json({ message: "권한 없음" });
      return;
    }

    if (error.message === "NO_DATA") {
      res.status(400).json({ message: "수정할 데이터가 없습니다." });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 상품 삭제
export const deleteProductController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    return;
  }

  try {
    await deleteProductService(Number(id), userId);
    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (error: any) {
    if (error.message === "NOT_FOUND_PRODUCT") {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }

    if (error.message === "NOT_FOUND_USER") {
      res.status(404).json({ message: "유저를 찾을 수 없습니다." });
      return;
    }

    if (error.message === "FORBIDDEN") {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};
