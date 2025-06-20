import { Request, Response } from "express";
import prisma from "../db/prisma/client.js";
import { Product, LikeToProduct, User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

// Express의 Request 객체에 user 프로퍼티를 확장하기 위한 타입 선언
declare global {
  namespace Express {
    interface Request {
      user?: User | JwtPayload;
    }
  }
}

// 응답에 사용할 Product 타입 확장
type ProductWithLikes = Product & {
    likes: LikeToProduct[];
    user: { id: number; userName: string; }
};

type ProductResponse = Omit<ProductWithLikes, 'likes'> & {
    favoriteCount: number;
    isLiked: boolean;
};


// 전체 상품 목록 조회
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || null;

    const products: ProductWithLikes[] = await prisma.product.findMany({
      include: {
        user: { select: { id: true, userName: true } },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result: ProductResponse[] = products.map((p) => ({
      ...p,
      favoriteCount: p.likes.length,
      isLiked: !!p.likes.find((l: LikeToProduct) => l.userId === userId),
      likes: undefined,
    }));

    res.status(200).json({ list: result, totalCount: result.length });
  } catch (error) {
    console.error("상품 전체 조회 오류:", error);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
};

// 상품 상세 조회
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const userId = req.user?.id || null;

    const product: ProductWithLikes | null = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: { select: { id: true, userName: true } },
        likes: true,
      },
    });

    if (!product) {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }

    const response: ProductResponse = {
        ...product,
        favoriteCount: product.likes.length,
        isLiked: !!product.likes.find((l: LikeToProduct) => l.userId === userId)
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    res.status(500).json({ message: "상품 상세 조회 실패" });
  }
};

// 상품 등록
interface CreateProductBody {
    name: string;
    description: string;
    price: string;
    image?: string;
    tags: string | string[];
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, image, tags }: CreateProductBody = req.body;
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        return;
    }

    const tagArray = Array.isArray(tags) ? tags : [tags];
    const cleanedTags = tagArray.filter(Boolean);

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        image,
        userId: userId,
        tags: cleanedTags,
      },
    });

    res.status(201).json({ message: "상품 등록 성공", product: newProduct });
  } catch (error) {
    console.error("상품 등록 오류:", error);
    res.status(500).json({ message: "상품 등록 실패" });
  }
};

// 상품 수정
interface UpdateProductBody {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
}
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    const { name, description, price, image }: UpdateProductBody = req.body;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { name, description, price, image },
    });

    res.status(200).json({ message: "상품 수정 성공", product: updated });
  } catch (error) {
    console.error("상품 수정 오류:", error);
    res.status(500).json({ message: "상품 수정 실패" });
  }
};

// 상품 삭제
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user?.id;

    if(!userId){
        res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }

    if (product.userId !== userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
    }

    await prisma.comment.deleteMany({ where: { productId } });
    await prisma.likeToProduct.deleteMany({ where: { productId } });

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json({ message: "상품 삭제 성공" });
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    res.status(500).json({ message: "상품 삭제 실패" });
  }
};

// 상품 댓글 조회
export const getProductComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const limit = parseInt(req.query.limit as string) || 20;

    const comments = await prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        writer: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });

    res.status(200).json({ list: comments, totalCount: comments.length });
  } catch (error) {
    console.error("상품 댓글 조회 오류:", error);
    res.status(500).json({ message: "댓글 조회 실패" });
  }
};

// 좋아요
export const likeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user?.id;

    if(!userId){
        res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        return;
    }

    const already = await prisma.likeToProduct.findFirst({
      where: { productId, userId },
    });

    if (already) {
      res.status(400).json({ message: "이미 좋아요를 눌렀습니다." });
      return;
    }

    const like = await prisma.likeToProduct.create({
        data: { productId, userId },
    });

    res.status(200).json({ message: "상품 좋아요 성공", like });
  } catch (error) {
    console.error("좋아요 오류:", error);
    res.status(500).json({ message: "좋아요 실패" });
  }
};

//  좋아요 취소
export const unlikeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user?.id;

    if(!userId){
        res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        return;
    }

    await prisma.likeToProduct.deleteMany({
        where: { productId, userId },
    });

    res.status(200).json({ message: "좋아요 취소 성공" });
  } catch (error) {
    console.error("좋아요 취소 오류:", error);
    res.status(500).json({ message: "좋아요 취소 실패" });
  }
}; 