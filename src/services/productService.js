import prisma from "../../prisma/client.prisma.js";
import productRepository from "../repositories/productRepository.js";

// 상품 목록 불러오기
const getProducts = async (query) => {
  const [products, totalCount] = await productRepository.findAll(query);

  if (!products || products.length === 0) {
    const error = new Error("상품이 없습니다.");
    error.code = 404;

    throw error;
  }

  return [products, totalCount];
};

// 상품 상세조회
const getProduct = async (userId, productId) => {
  return await prisma.$transaction(async (tx) => {
    const [product, images, isLiked] = await productRepository.findByIdWithTx(
      tx,
      userId,
      productId
    );

    if (!product) {
      const error = new Error("존재하지 않는 상품입니다.");
      error.code = 404;

      throw error;
    }

    const productTag = await productRepository.findProductTagByIdWithTx(
      tx,
      productId
    );

    const tags = productTag.map((tag) => tag.tag.name);
    const imageUrls = images.map((image) => image.imageUrl);

    return { ...product, tags, images: imageUrls, isLiked: !!isLiked };
  });
};

// 상품 등록
const createProduct = async (userId, body, images) => {
  const { tags } = body;

  return await prisma.$transaction(async (tx) => {
    const newProduct = await productRepository.createWithTx(tx, body);

    const newTags = await Promise.all(
      JSON.parse(tags).map(async (tagName) => {
        let tag = await productRepository.findTagByNameWithTx(tx, tagName);

        if (!tag) {
          tag = await productRepository.createTagWithTx(tx, tagName);
        }

        await productRepository.createProductTagWithTx(
          tx,
          newProduct.id,
          tag.id
        );

        return tag.name;
      })
    );

    const newImages = await Promise.all(
      images.map(async (image) => {
        const newImage = await productRepository.createProductImageWithTx(
          tx,
          image.filename,
          userId,
          newProduct.id
        );

        return newImage.imageUrl;
      })
    );

    return { ...newProduct, tags: newTags, images: newImages };
  });
};

// 상품 수정
const updateProduct = async (userId, productId, body, images) => {
  const { tags } = body;

  return await prisma.$transaction(async (tx) => {
    const updatedProduct = await productRepository.updateProductWithTx(
      tx,
      productId,
      body
    );

    await productRepository.deleteProductTagsWithTx(tx, productId);

    const updatedTags = await Promise.all(
      JSON.parse(tags).map(async (tagName) => {
        let tag = await productRepository.findTagByNameWithTx(tx, tagName);

        if (!tag) {
          tag = await productRepository.createTagWithTx(tx, tagName);
        }

        await productRepository.createProductTagWithTx(tx, productId, tag.id);

        return tag.name;
      })
    );

    await productRepository.deleteProductImageWithTx(tx, productId);

    const updatedImages = await Promise.all(
      images.map(async (image) => {
        const updatedImage = await productRepository.createProductImageWithTx(
          tx,
          image.filename,
          userId,
          productId
        );

        return updatedImage.imageUrl;
      })
    );

    return { ...updatedProduct, tags: updatedTags, images: updatedImages };
  });
};

// 상품 삭제
const deleteProduct = async (productId) => {
  return await prisma.$transaction(async (tx) => {
    const product = await productRepository.findByIdWithTx(tx, productId);

    if (!product) {
      const error = new Error("이미 삭제된 상품입니다.");
      error.code = 404;

      throw error;
    }

    return productRepository.deleteProductWithTx(tx, productId);
  });
};

// 상품 좋아요
const addlikeProduct = (userId, productId) => {
  return productRepository.addlikeProduct(userId, productId);
};

// 상품 좋아요 취소
const cancelLikeProduct = (userId, productId) => {
  return productRepository.cancelLikeProduct(userId, productId);
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addlikeProduct,
  cancelLikeProduct,
};
