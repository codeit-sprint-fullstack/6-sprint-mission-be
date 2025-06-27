import {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
} from "../dtos/product.dto.js";
import {
  createProductRepo,
  getAllProductsRepo,
  getProductByIdRepo,
  updateProductRepo,
  getUserNicknameByIdRepo,
  deleteProductRepo
} from "../repositories/product.repository.js";

export const createProductService = async (
  dto: CreateProductDTO
): Promise<ProductResponseDTO> => {
  const product = await createProductRepo(dto);

  // 응답에 필요한 가공
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    image: product.image,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    ownerNickname: product.user.nickname,
    favoritesCount: 0,
    isFavorite: false,
  };
};

export const getAllProductsService = async (): Promise<
  ProductResponseDTO[]
> => {
  const products = await getAllProductsRepo();

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    image: product.image,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    ownerNickname: product.user.nickname,
    favoritesCount: 0,
    isFavorite: false,
  }));
};

export const getProductByIdService = async (
  productId: number,
  userId?: number
): Promise<ProductResponseDTO | null> => {
  const product = await getProductByIdRepo(productId);

  if (!product) return null;

  const isFavorite = product.favorites.some((fav) => fav.userId === userId);
  const favoritesCount = product.favorites.length;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    image: product.image,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    ownerNickname: product.user?.nickname ?? "알 수 없음",
    favoritesCount,
    isFavorite,
  };
};

//상품 수정
export const updateProductService = async (
  productId: number,
  userId: number | undefined,
  dto: UpdateProductDTO
) => {
  const product = await getProductByIdRepo(productId);
  if (!product) throw new Error("NOT_FOUND");
  if (product.userId !== userId) throw new Error("FORBIDDEN");

  const dataToUpdate: UpdateProductDTO = {};
  if (dto.name) dataToUpdate.name = dto.name;
  if (dto.description) dataToUpdate.description = dto.description;
  if (dto.price !== undefined) dataToUpdate.price = dto.price;

  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error("NO_DATA");
  }

  return await updateProductRepo(productId, dataToUpdate);
};

//상품 삭제
export const deleteProductService = async (
  productId: number,
  userId?: number
): Promise<void> => {
  const product = await getProductByIdRepo(productId);
  if (!product) throw new Error("NOT_FOUND_PRODUCT");

  const user = await getUserNicknameByIdRepo(userId);
  if (!user) throw new Error("NOT_FOUND_USER");

  if (product.userId !== userId) throw new Error("FORBIDDEN");

  await deleteProductRepo(productId);
};