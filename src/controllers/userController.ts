import { NextFunction, Request, RequestHandler, Response } from "express";
import userService from "../services/userService";

// 인증된 요청 타입
interface AuthRequest<T = any> extends Request {
  body: T;
  auth: {
    userId: number;
  };
}

// GET /users/me
export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as AuthRequest).auth.userId;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me
export const updateMe: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as AuthRequest).auth.userId;
    const updated = await userService.updateUser(userId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me/password
export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as AuthRequest).auth.userId;
    const { currentPassword, newPassword } = req.body; // currentPassword 추가

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
      });
      return;
    }

    const updated = await userService.changePassword(
      userId,
      currentPassword, // 추가
      newPassword
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// GET /users/me/products
export const getMyProducts: RequestHandler = async (req, res, next) => {
  try {
    res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    next(err);
  }
};

// GET /users/me/favorites
export const getMyFavorites: RequestHandler = async (req, res, next) => {
  try {
    res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    next(err);
  }
};
