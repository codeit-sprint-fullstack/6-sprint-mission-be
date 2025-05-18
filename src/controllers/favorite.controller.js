import * as favoriteService from '../services/favorite.service.js';

export const create = async (req, res) => {
  const { productId } = req.body; 
  const userId = req.userId;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const productIdNumber = Number(productId);

  if (isNaN(productIdNumber)) {
    return res.status(400).json({ message: "Product ID must be a valid number" });
  }

  try {
    const favorite = await favoriteService.addFavorite(userId, productIdNumber);
    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: '이미 좋아요 추가됨' });
    }
    res.status(500).json({ message: err.message });
  }
};




export const remove = async (req, res) => {
  const { productId } = req.body;  
  const userId = req.userId; 

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

 
  const productIdNumber = Number(productId);

  if (isNaN(productIdNumber)) {
    return res.status(400).json({ message: "Product ID must be a valid number" });
  }

  try {
    await favoriteService.removeFavorite(userId, productIdNumber);
    res.status(200).json({ message: '좋아요 삭제됨' });
  } catch (err) {
    console.error("좋아요 삭제 에러:", err);
    res.status(500).json({ message: err.message });
  }
};





export const getByUser = async (req, res) => {
  const userId = req.userId; 
  try {
    const favorites = await favoriteService.listUserFavorites(userId);
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
