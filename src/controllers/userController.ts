import authService from "../service/authService";
import { NextFunction, Request, Response } from "express";
import userService from "../service/userService";
import { UserFilteredDto } from "../dtos/user.dto";

// 유저 프로필 정보 조회
const getProfile = async (
  req: NonNullable<Request>,
  res: Response<{ user: UserFilteredDto }>,
  next: NextFunction
) => {
  try {
    const userId = req.auth!.userId;
    const user = await userService.getUserById(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// 유저 정보 수정
const updateUser = async (
  req: NonNullable<Request>,
  res: Response<{ user: UserFilteredDto }>,
  next: NextFunction
) => {
  try {
    const userId = req.auth!.userId;
    const file = req.file as Express.MulterS3.File;
    const imagePath = file ? file.location : undefined;

    const data = {
      ...req.body,
      image: imagePath,
    };

    const updated = await userService.updateUser(userId, data);
    res.json({ user: updated });
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
const changePassword = async (
  req: NonNullable<Request>,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  try {
    const userId = req.auth!.userId;
    const { currentPassword, newPassword } = req.body;

    // 현재 비밀번호 검증 및 새 비밀번호로 변경
    await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    next(error);
  }
};

export default {
  updateUser,
  getProfile,
  changePassword,
};
