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
    const { image: newImage, ...otherData } = req.body;

    // 기존 유저 정보 조회 (프로필 이미지 정보 필요)
    const existingUser = await userService.getUserById(userId);
    const oldImage = existingUser.image;

    // 이미지는 이미 S3에 업로드되어 URL로 전달됨
    const data = {
      ...otherData,
      image: newImage,
    };

    // DB 업데이트
    const updated = await userService.updateUser(userId, data);

    // 🗑️ 기존 프로필 이미지가 있고, 새 이미지와 다르면 S3에서 삭제 (비동기)
    if (oldImage && newImage && oldImage !== newImage) {
      const { deleteS3Image } = await import("../utils/s3Helper");
      deleteS3Image(oldImage).catch((error) => {
        console.error("프로필 이미지 삭제 중 오류:", error);
      });
    }

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
