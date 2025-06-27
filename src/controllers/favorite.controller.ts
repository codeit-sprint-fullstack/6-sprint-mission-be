import { Request, Response } from 'express';
import * as favoriteService from '../services/favorite.service';
import { AddFavoriteDTO } from '../dtos/favorite.dto';

interface AuthRequest extends Request {
  userId?: number;
}

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    return;
  }

  const { productId } = req.body as AddFavoriteDTO;
  if (!productId) {
    res.status(400).json({ message: "상품 ID가 필요합니다." });
    return;
  }

  const productIdNumber = Number(productId);
  if (isNaN(productIdNumber)) {
    res.status(400).json({ message: "상품 ID는 유효한 숫자여야 합니다." });
    return;
  }

  try {
    const favorite = await favoriteService.addFavorite(userId, productIdNumber);
    res.status(201).json(favorite);
    return;
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ message: '이미 좋아요가 추가되어 있습니다.' });
      return;
    }
    res.status(500).json({ message: err.message });
    return;
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    return;
  }

  const { productId } = req.body as AddFavoriteDTO;
  if (!productId) {
    res.status(400).json({ message: "상품 ID가 필요합니다." });
    return;
  }

  const productIdNumber = Number(productId);
  if (isNaN(productIdNumber)) {
    res.status(400).json({ message: "상품 ID는 유효한 숫자여야 합니다." });
    return;
  }

  try {
    await favoriteService.removeFavorite(userId, productIdNumber);
    res.status(200).json({ message: '좋아요가 삭제되었습니다.' });
    return;
  } catch (err: any) {
    console.error("좋아요 삭제 에러:", err);
    res.status(500).json({ message: err.message });
    return;
  }
};

export const getByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    return;
  }

  try {
    const favorites = await favoriteService.listUserFavorites(userId);
    res.status(200).json(favorites);
    return;
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
};
