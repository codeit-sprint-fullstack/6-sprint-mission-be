const prisma = require("../config/prismaClient.js");
const getSort = require("../utils/sort.js");
const pagination = require("../utils/pagination.js");

// id 찾기
async function findById(id) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

/**
 * POST
 */
async function create(product, userId) {
  const { name, description, price, tags, images } = product;

  // sql 공부하자22...
  await prisma.$executeRawUnsafe(`
  SELECT setval(pg_get_serial_sequence('"Product"', 'id'), (
    SELECT MAX(id) FROM "Product"
  ) + 1
);
`);

  const newProduct = await prisma.product.create({
    include: {
      tags: true,
      images: true,
    },
    data: {
      name: name,
      description: description,
      price: parseInt(price, 10),
      authorId: userId,
      tags:
        Array.isArray(tags) && tags.length > 0
          ? {
              create: tags.map((tag) => ({ tag })),
            }
          : undefined,
      images:
        Array.isArray(images) && images.length > 0
          ? {
              create: images.map((imageUrl) => ({ imageUrl })),
            }
          : undefined,
    },
  });

  return newProduct;
}

/**
 * 전체 GET
 */
async function getAll(query = {}) {
  // 정렬, page 설정
  const orderBy = getSort("product", query.orderBy);

  const isCursor = !query.cursor;

  const pageOption = isCursor
    ? pagination.getCursor(query)
    : pagination.getOffset(query);

  // 전체 게시글 개수
  const totalCount = await prisma.product.count();

  // 불러올 field
  const products = await prisma.product.findMany({
    orderBy,
    ...pageOption,
    include: {
      author: { select: { id: true, nickname: true } },
      images: { select: { id: true, imageUrl: true } },
    },
  });

  // network에서 불러오는 형태 가공
  const formattedApi = products.map((product) => {
    return {
      ...product,
      images: product.images.length > 0 ? [product.images[0]] : [],
    };
  });

  // 반환
  return { totalCount, products: formattedApi };
}

/**
 * GET
 */
async function getById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, nickname: true } },
      images: { select: { id: true, imageUrl: true } },
      tags: { select: { id: true, tag: true } },
      commentToProduct: {
        select: {
          id: true,
          content: true,
          updatedAt: true,
          author: { select: { nickname: true } },
        },
      },
      likes: {
        select: { id: true },
      },
    },
  });

  if (!product) return null;

  const { likes, ...rest } = product;

  return {
    ...rest,
    isLiked: likes.length > 0,
    images: product.images || [],
    tags: product.tags || [],
  };
}

/**
 * DELETE
 */
async function remove(id) {
  return await prisma.product.delete({
    where: { id },
  });
}

/**
 * PATCH
 */
async function update(id, product, userId) {
  const { name, description, price, tags, images } = product;
  const data = {};

  // data가 비어 있어도 들어가야 하는데 그냥 넣으면 기본 값이 돼서 빼줘야 함
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = parseInt(price, 10);
  if (userId !== undefined) data.authorId = userId;

  if (Array.isArray(tags) && tags.length > 0) {
    data.tags = {
      deleteMany: {}, // 기존 태그 삭제
      create: tags.map((tag) => ({ tag })),
    };
  }

  if (Array.isArray(images) && images.length > 0) {
    data.images = {
      deleteMany: {}, // 기존 이미지 삭제
      create: images.map((imageUrl) => ({ imageUrl })),
    };
  }

  return await prisma.product.update({
    where: { id },
    include: {
      tags: true,
      images: true,
    },
    data,
  });
}

/**
 * 좋아요
 */
async function findLike(userId, productId) {
  return await prisma.likeToProduct.findUnique({
    where: {
      productId_userId: { productId, userId },
    },
  });
}

async function createLike(userId, productId) {
  // transaction: 좋아요 표와 제품 표에 정보를 같이 저장
  return await prisma.$transaction(async (tx) => {
    await tx.likeToProduct.create({
      data: { userId, productId },
    });

    await tx.product.update({
      where: { id: productId },
      select: { likeCount: true },
      data: { likeCount: { increment: 1 } },
    });
  });
}

async function deleteLike(userId, productId) {
  return await prisma.$transaction(async (tx) => {
    await tx.likeToProduct.delete({
      where: { productId_userId: { productId, userId } },
    });

    await tx.product.update({
      where: { id: productId },
      data: { likeCount: { decrement: 1 } },
    });
  });
}

const productRepository = {
  findById,
  create,
  getAll,
  getById,
  remove,
  update,
  findLike,
  createLike,
  deleteLike,
};

module.exports = productRepository;
