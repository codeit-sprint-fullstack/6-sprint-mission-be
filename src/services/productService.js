import productRepository from "../repositories/productRepository.js";

// 상품 등록
async function createProduct(productData, userId) {
  return productRepository.create({
    ...productData,
    ownerId: userId,
    favoriteCount: 0,
  });
}

// 상품 목록 조회 (페이징 + 정렬 포함)
async function getAllProducts({ page = 1, pageSize = 10, orderBy = "recent" }) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const order =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const [list, totalCount] = await Promise.all([
    productRepository.findAll({ skip, take, orderBy: order }),
    productRepository.count(),
  ]);

  return { list, totalCount };
}

// 상품 상세 조회
async function getProductById(id, userId) {
  const product = await productRepository.findById(id, userId);
  if (!product) {
    const error = new Error("상품을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
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
async function deleteProduct(id) {
  const product = await productRepository.findById(id);
  if (!product) {
    const error = new Error("해당 상품을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  await productRepository.remove(id);
  return { id };
}

// 상품 수정
async function updateProduct(id, productData) {
  const product = await productRepository.findById(id);
  if (!product) {
    const error = new Error("수정할 상품을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  // existingImages 때문에 명시적 필터링
  const cleanData = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    tags: productData.tags,
    images: productData.images,
    ownerId: productData.ownerId,
  };

  const updated = await productRepository.update(id, cleanData);
  return updated;
}

export default {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
