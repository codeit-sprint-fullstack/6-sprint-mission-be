import { Product } from "@prisma/client";
import productRepository from "../repositories/productRepository";
import { NotFoundError } from "@/types/errors";

// 상품 등록
async function createProduct(
  productData: Pick<
    Product,
    "name" | "description" | "price" | "tags" | "images"
  >,
  userId: number
): Promise<Product> {
  return productRepository.create({
    ...productData,
    ownerId: userId,
    favoriteCount: 0,
  });
}

// 상품 목록 조회 (페이징 + 정렬 포함)
async function getAllProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
}: {
  page?: number;
  pageSize?: number;
  orderBy?: "recent" | "favorite";
}) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const order: { [key: string]: "desc" | "asc" } =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  // // or
  // const order =
  //   orderBy === "favorite"
  //     ? ({ favoriteCount: "desc" } as const)
  //     : ({ createdAt: "desc" } as const);

  const [list, totalCount] = await Promise.all([
    productRepository.findAll({ skip, take, orderBy: order }),
    productRepository.count(),
  ]);

  return { list, totalCount };
}

// 상품 상세 조회
async function getProductById(id: number, userId?: number) {
  const product = await productRepository.findById(id, userId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  const { owner, favorites, ...rest } = product;

  return {
    ...rest,
    ownerNickname: owner?.nickName || "알 수 없음", // null fallback 처리
    favoriteCount: product.favoriteCount,
    isFavorite: product.isFavorite,
  };
}

// 상품 삭제
async function deleteProduct(id: number) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new NotFoundError("해당 상품을 찾을 수 없습니다.");
  }

  await productRepository.remove(id);
  return { id };
}

// 상품 수정
async function updateProduct(
  id: number,
  productData: Pick<
    Product,
    "name" | "description" | "price" | "tags" | "images"
  > & { ownerId: number }
): Promise<Product> {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new NotFoundError("수정할 상품을 찾을 수 없습니다.");
  }

  const updated = await productRepository.update(id, productData);
  return updated;
}

export default {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
