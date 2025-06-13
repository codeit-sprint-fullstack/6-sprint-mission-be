import { Product, User, Prisma } from "@prisma/client";
import productRepository from "../repositories/productRepository";

// 상품조회
async function getProducts({
  page = 0,
  pageSize = 10,
  orderBy = "latest",
  keyWord,
  userId = "",
}: {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyWord?: string;
  userId?: string;
}) {
  const skip = Number(page) * Number(pageSize);
  const take = Number(pageSize);

  const where = keyWord
    ? {
        name: {
          contains: keyWord,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  // ✅ 정렬 조건 분기
  const orderByOption =
    orderBy === "likes"
      ? { likes: Prisma.SortOrder.desc }
      : { createdAt: Prisma.SortOrder.desc };

  // ✅ 전체 상품과 총 개수 fetch
  const [products, total] = await Promise.all([
    productRepository.findAll({
      skip,
      take,
      where,
      orderBy: orderByOption,
    }),
    productRepository.countAll(where),
  ]);

  // ✅ 유저가 좋아요 누른 상품 ID 목록 조회
  let likedProductIds: string[] = [];
  if (userId) {
    const likes = await productRepository.findLikedProductIdsByUser(
      userId,
      products.map((p) => p.id)
    );
    likedProductIds = likes.map((like) => like.productId);
  }

  // ✅ isLiked 필드 추가
  const productsWithLike = products.map((product) => {
    // user 정보 추출
    const { user, ...productData } = product;

    return {
      ...productData,
      author: user, // 작성자 정보 추가
      isLiked: likedProductIds.includes(product.id),
    };
  });

  return {
    products: productsWithLike,
    pagination: {
      total,
      page: Number(page),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    },
    sort: orderBy,
  };
}

// 특정 상품 조회
async function getProductById(productId: Product["id"], userId?: User["id"]) {
  const product = await productRepository.findById(productId, userId);

  if (!product) throw { code: "P2025" };

  const isLiked = userId ? product.ProductLike.length > 0 : false;

  // ProductLike와 user 정보 추출
  const { ProductLike, user, ...rest } = product;

  // ProductLike 제외
  return {
    ...rest,
    author: user, // 작성자 정보 추가
    isLiked,
  };
}

async function createProduct({
  name,
  description,
  price,
  tags = [],
  userId,
  image,
}: {
  name: string | undefined;
  description: string | undefined;
  price: number | string | undefined;
  tags?: string[];
  userId: string;
  image: string[];
}) {
  if (!name || !description || !price) {
    throw new Error("이름, 설명, 가격은 필수입니다.");
  }

  const productData = {
    name,
    description,
    price: Number(price),
    tags,
    likes: 0,
    userId,
    image,
  };

  return productRepository.create(productData);
}

async function updateProduct(id: Product["id"], data: Partial<Product>) {
  return productRepository.update(id, data);
}

async function deleteProduct(id: Product["id"]) {
  return productRepository.remove(id);
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
