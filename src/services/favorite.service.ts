import {
  createFavorite,
  deleteFavorite,
  getFavoritesByUser,
} from '../repositories/favorite.repository';

export const addFavorite = async (userId: number, productId: number) => {
  return await createFavorite(userId, productId);
};

export const removeFavorite = async (userId: number, productId: number) => {
  return await deleteFavorite(userId, productId);
};

export const listUserFavorites = async (userId: number) => {
  return await getFavoritesByUser(userId);
};
