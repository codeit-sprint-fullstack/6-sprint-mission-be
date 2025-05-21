import prisma from "../db/prisma/client.js";

// 전체 상품 목록 조회
export const getAllProducts = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const products = await prisma.product.findMany({
      include: {
        user: { select: { id: true, userName: true } },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = products.map((p) => ({
      ...p,
      favoriteCount: p.likes.length,
      isLiked: !!p.likes.find((l) => l.userId === userId),
      likes: undefined,
    }));

    res.status(200).json({ list: result, totalCount: result.length });
  } catch (error) {
    console.error("상품 전체 조회 오류:", error);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
};

// 상품 상세 조회
export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const userId = req.user?.id || null;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: { select: { id: true, userName: true } },
        likes: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const favoriteCount = product.likes.length;
    const isLiked = !!product.likes.find((l) => l.userId === userId);

    res.status(200).json({
      ...product,
      favoriteCount,
      isLiked,
      likes: undefined,
    });
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    res.status(500).json({ message: "상품 상세 조회 실패" });
  }
};

// 상품 등록
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, tags } = req.body;

    const tagArray = Array.isArray(tags) ? tags : [tags];
    const cleanedTags = tagArray.filter(Boolean);

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        image,
        userId: req.user.id,
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
export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const { name, description, price, image } = req.body;

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
export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
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
export const getProductComments = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const limit = parseInt(req.query.limit) || 20;

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
export const likeProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;

    const already = await prisma.likeToProduct.findFirst({
      where: { productId, userId },
    });

    if (already) {
      return res.status(400).json({ message: "이미 좋아요를 눌렀습니다." });
    }

    const [like] = await prisma.$transaction([
      prisma.likeToProduct.create({
        data: { productId, userId },
      }),
    ]);

    res.status(200).json({ message: "상품 좋아요 성공", like });
  } catch (error) {
    console.error("좋아요 오류:", error);
    res.status(500).json({ message: "좋아요 실패" });
  }
};

//  좋아요 취소
export const unlikeProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;

    await prisma.$transaction([
      prisma.likeToProduct.deleteMany({
        where: { productId, userId },
      }),
    ]);

    res.status(200).json({ message: "좋아요 취소 성공" });
  } catch (error) {
    console.error("좋아요 취소 오류:", error);
    res.status(500).json({ message: "좋아요 취소 실패" });
  }
};
