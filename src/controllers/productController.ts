import { NextFunction, Request, Response } from "express";
import productService from "../services/productService";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, price, tags } = req.body;
    const imagePaths = (req.files as Express.Multer.File[])?.map(
      (file) => file.path
    );

    const parsedTags =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : [];

    const product = await productService.createProduct({
      name,
      description,
      price: Number(price),
      images: imagePaths,
      tags: parsedTags,
      owner: { connect: { id: req.auth.userId } },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

// 전체 상품 목록
export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth?.userId ?? null; // 로그인 안 했으면 null
    const sortBy = req.query.sort?.toString() || "latest"; // 정렬 옵션 (기본값: 최신순)

    const products = await productService.getAllProductsWithLikes(
      userId,
      sortBy
    );
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// 상세 상품
export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const userId = req.auth?.userId ?? null;

    const product = await productService.getProductById(id, userId);

    if (!product) {
      res.status(404).json({ message: "상품이 존재하지 않습니다." });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// 상품 수정
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.id);
    const userId = req.auth.userId;
    const { name, description, price, tags } = req.body;
    const imagePaths =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((file) => file.path)
        : undefined;

    const updated = await productService.updateProduct({
      id: productId,
      userId,
      data: {
        name,
        description,
        price: price ? Number(price) : undefined,
        tags: tags ? JSON.parse(tags) : undefined,
        images: imagePaths,
      },
    });
    // 수정된 결과에 다시 isLiked 포함해서 반환
    const fullProduct = await productService.getProductById(productId, userId);
    res.json(fullProduct);
  } catch (err) {
    next(err);
  }
}

// 상품 삭제
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.id);
    await productService.deleteProduct(productId, req.auth.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

//좋아요
export async function likeProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.id);
    const userId = req.auth.userId;

    const result = await productService.likeProduct(productId, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

//un좋아요
export async function unlikeProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.id);
    const userId = req.auth.userId;

    await productService.unlikeProduct(productId, userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

// 베스트 상품 조회 함수 추가
export async function getBestProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).auth?.userId ?? null;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;

    const bestProducts = await productService.getBestProducts(userId, limit);
    res.json(bestProducts);
  } catch (err) {
    next(err);
  }
}
