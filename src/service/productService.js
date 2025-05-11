import productRepository from "../repositories/productRepository.js";

// 상품조회
async function getProducts({
  page = 0,
  pageSize = 10,
  orderBy = "recent",
  keyWord = "",
  userId = null, // ✅ 유저 ID 추가
}) {
  const skip = Number(page) * Number(pageSize);
  const take = Number(pageSize);

  const where = keyWord
    ? {
        name: {
          contains: keyWord,
          mode: "insensitive",
        },
      }
    : {};

  const orderByOption = {
    createdAt: orderBy === "recent" ? "desc" : "asc",
  };

  const [products, total] = await Promise.all([
    productRepository.findAll({ skip, take, where, orderBy: orderByOption }),
    productRepository.countAll(where),
  ]);

  // ✅ 유저가 좋아요 누른 상품 ID 목록 조회
  let likedProductIds = [];
  if (userId) {
    const likes = await productRepository.findLikedProductIdsByUser(
      userId,
      products.map((p) => p.id)
    );
    likedProductIds = likes.map((like) => like.productId);
  }

  // ✅ products에 isLiked 필드 추가
  const productsWithLike = products.map((product) => ({
    ...product,
    isLiked: likedProductIds.includes(product.id),
  }));

  return {
    products: productsWithLike,
    // TODO : offset과 limit로 변수명 수정하기
    pagination: {
      total,
      page: Number(page),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    },
  };
}

// 특정 상품 조회
async function getProductById(productId, userId = null) {
  const product = await productRepository.findById(productId, userId);

  if (!product) throw { code: "P2025" };

  const isLiked = userId ? product.ProductLike.length > 0 : false;

  const { ProductLike, ...rest } = product;

  // ProductLike 제외
  return {
    ...rest,
    isLiked,
  };
}

async function createProduct({ name, description, price, tags = [], userId }) {
  const productData = {
    name,
    description,
    price: Number(price),
    tags,
    likes: 0,
    userId,
  };

  return productRepository.create(productData);
}

async function updateProduct(id, data) {
  return productRepository.update(id, data);
}

async function deleteProduct(id) {
  return productRepository.remove(Number(id));
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
