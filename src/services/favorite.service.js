import {
  createFavorite,
  deleteFavorite,
  getFavoritesByUser,
} from '../repositories/favorite.repository.js';

export const addFavorite = async (userId, productId) => {
  return await createFavorite(userId, productId);
};

export const removeFavorite = async (userId, productId) => {
  return await deleteFavorite(userId, productId);
};

export const listUserFavorites = async (userId) => {
  return await getFavoritesByUser(userId);
};
