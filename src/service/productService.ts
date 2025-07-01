import { Prisma } from "@prisma/client";
import productRepository from "../repositories/productRepository";
import { ProductCreateDto, ProductParamsDto } from "../dtos/product.dto";
import { UserParamsDto } from "../dtos/user.dto";
import { processImageUrls } from "../utils/s3Helper";

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

  // ✅ isLiked 필드 추가 및 이미지 처리
  const productsWithLike = await Promise.all(
    products.map(async (product) => {
      // user 정보 추출
      const { user, images, ...productData } = product;

      // 이미지 URL 처리 (private이면 presigned URL 생성)
      const processedImages = await processImageUrls(images || []);

      return {
        ...productData,
        images: processedImages,
        author: user, // 작성자 정보 추가
        isLiked: likedProductIds.includes(product.id),
      };
    })
  );

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
async function getProductById(
  productId: ProductParamsDto["id"],
  userId?: UserParamsDto["id"]
) {
  const product = await productRepository.findById(productId, userId);

  if (!product) throw { code: "P2025" };

  const isLiked = userId ? product.productLikes.length > 0 : false;

  // ProductLike와 user 정보 추출
  const { productLikes, user, images, ...rest } = product;

  // 이미지 URL 처리 (private이면 presigned URL 생성)
  const processedImages = await processImageUrls(images || []);

  return {
    ...rest,
    images: processedImages,
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
  images,
}: {
  name: string | undefined;
  description: string | undefined;
  price: number | string | undefined;
  tags?: string[];
  userId: string;
  images: string[];
}) {
  if (!name || !description || !price) {
    throw new Error("이름, 설명, 가격은 필수입니다.");
  }

  const productData = {
    name,
    description,
    price: Number(price),
    images,
    likes: 0,
    tags,
    userId,
  };

  return productRepository.create(productData);
}

async function updateProduct(
  id: ProductParamsDto["id"],
  data: Partial<ProductCreateDto>
) {
  return productRepository.update(id, data);
}

async function deleteProduct(id: ProductParamsDto["id"]) {
  return productRepository.remove(id);
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
