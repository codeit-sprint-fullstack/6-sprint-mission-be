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
const getProduct = async (productId) => {
  return await prisma.$transaction(async (tx) => {
    const product = await productRepository.findByIdWithTx(tx, productId);

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

    return { ...product, tags };
  });
};

// 상품 등록
const createProduct = async (body) => {
  const { name, description, price, tags } = body;

  if (!name || !description || !price || !tags) {
    const error = new Error("필수 항목을 모두 입력해주세요.");
    error.code = 400;

    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    const newProduct = await productRepository.createWithTx(tx, body);

    const newTags = await Promise.all(
      tags.map(async (tagName) => {
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

    return { ...newProduct, tags: newTags };
  });
};

// 상품 수정
const updateProduct = async (productId, body) => {
  const { name, description, price, tags } = body;

  if (!(name || description || price || tags)) {
    const error = new Error("수정할 내용을 입력해주세요.");
    error.code = 400;

    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    const updatedProduct = await productRepository.updateProductWithTx(
      tx,
      productId,
      body
    );

    await productRepository.deleteProductTagsWithTx(tx, productId);

    const updatedTags = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await productRepository.findTagByNameWithTx(tx, tagName);

        if (!tag) {
          tag = await productRepository.createTagWithTx(tx, tagName);
        }

        await productRepository.createProductTagWithTx(tx, productId, tag.id);

        return tag.name;
      })
    );

    return { ...updatedProduct, tags: updatedTags };
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

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
