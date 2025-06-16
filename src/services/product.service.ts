import { Product, User } from "@prisma/client";
import prisma from "../config/client.prisma";
import productRepository from "../repositories/product.repository";
import { NotFoundError } from "../types/errors";

type TGetProductsQuery = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};

type TGetProductsResult = Promise<
  [
    {
      likeCount: number;
      productImages: {
        imageUrl: string;
      }[];
      name: string;
      id: number;
      price: number;
      createdAt: Date;
    }[],
    number
  ]
>;

// 상품 목록 불러오기
const getProducts = async (query: TGetProductsQuery): TGetProductsResult => {
  const [products, totalCount] = await productRepository.findAll(query);

  if (!products || products.length === 0)
    throw new NotFoundError("상품이 없습니다.");

  const productWithLikeCount = await Promise.all(
    products.map(async (product) => {
      const likeCount = await productRepository.findProductLikeCountById(
        product.id
      );

      return { ...product, likeCount };
    })
  );

  return [productWithLikeCount, totalCount];
};

// 상품 상세조회
const getProduct = async (userId: User["id"], productId: Product["id"]) => {
  return await prisma.$transaction(async (tx) => {
    const [product, images, likeCount, isLiked] =
      await productRepository.findById(userId, productId);

    if (!product) throw new NotFoundError("존재하지 않는 상품입니다.");

    const productTags = await productRepository.findProductTagById(productId);

    const tags = productTags.map((tag) => tag.tag.name);
    const imageUrls = images.map((image) => image.imageUrl);

    return {
      ...product,
      tags,
      images: imageUrls,
      likeCount,
      isLiked: !!isLiked,
    };
  });
};

// 상품 등록
const createProduct = async (
  userId: User["id"],
  body: Pick<Product, "name" | "description" | "price"> & { tags: string },
  images: Express.Multer.File[]
) => {
  const { tags } = body;

  return await prisma.$transaction(async (tx) => {
    const newProduct = await productRepository.createProduct(userId, body, {
      tx,
    });

    const newTags = await Promise.all(
      (JSON.parse(tags) as string[]).map(async (tagName) => {
        let tag = await productRepository.findTagByName(tagName);

        if (!tag) {
          tag = await productRepository.createTag(tagName, { tx });
        }

        await productRepository.createProductTag(newProduct.id, tag.id, { tx });

        return tag.name;
      })
    );

    const newImages = await Promise.all(
      images.map(async (image) => {
        const newImage = await productRepository.createProductImage(
          userId,
          newProduct.id,
          image.filename,
          { tx }
        );

        return newImage.imageUrl;
      })
    );

    return { ...newProduct, tags: newTags, images: newImages };
  });
};

// 상품 수정
const updateProduct = async (
  userId: User["id"],
  productId: Product["id"],
  body: Pick<Product, "name" | "description" | "price"> & { tags: string },
  images: Express.Multer.File[]
) => {
  const { tags } = body;

  return await prisma.$transaction(async (tx) => {
    const updatedProduct = await productRepository.updateProduct(
      productId,
      body,
      { tx }
    );

    await productRepository.deleteProductTags(productId, { tx });

    const updatedTags = await Promise.all(
      (JSON.parse(tags) as string[]).map(async (tagName) => {
        let tag = await productRepository.findTagByName(tagName);

        if (!tag) {
          tag = await productRepository.createTag(tagName, { tx });
        }

        await productRepository.createProductTag(productId, tag.id, { tx });

        return tag.name;
      })
    );

    await productRepository.deleteProductImage(productId, { tx });

    const updatedImages = await Promise.all(
      images.map(async (image) => {
        const updatedImage = await productRepository.createProductImage(
          userId,
          productId,
          image.filename,
          { tx }
        );

        return updatedImage.imageUrl;
      })
    );

    return { ...updatedProduct, tags: updatedTags, images: updatedImages };
  });
};

// 상품 삭제
const deleteProduct = async (userId: User["id"], productId: Product["id"]) => {
  return await prisma.$transaction(async (tx) => {
    const product = await productRepository.findById(userId, productId);

    if (!product) throw new NotFoundError("이미 삭제된 상품입니다.");

    return productRepository.deleteProduct(productId, { tx });
  });
};

// 상품 좋아요
const addlikeProduct = (userId: User["id"], productId: Product["id"]) => {
  return productRepository.addlikeProduct(userId, productId);
};

// 상품 좋아요 취소
const cancelLikeProduct = (userId: User["id"], productId: Product["id"]) => {
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
