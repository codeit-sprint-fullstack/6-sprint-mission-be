// src/controllers/imageController.ts

import express, { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import passport from "../config/passport";
import { CustomError } from "../utils/CustomError";
import uploadMiddleware from "../middlewares/uploadMiddleware";
import { TokenUserPayload } from "../services/authService";

declare global {
  namespace Express {
    interface User extends TokenUserPayload {
      id: number;
    }
  }
}

const imageController = express.Router();

imageController.post(
  "/upload",
  passport.authenticate("access-token", { session: false }),
  uploadMiddleware.array("image", 5),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as { location: string }[] | undefined;
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new CustomError(400, "업로드할 이미지 파일들이 없습니다.");
    }

    if (!req.user || !req.user.id) {
      throw new CustomError(
        401,
        "인증된 사용자만 이미지를 업로드할 수 있습니다."
      );
    }

    const uploaderId = req.user.id;

    res.status(201).json({
      message: "이미지들이 성공적으로 업로드되었습니다.",
      imageUrl: files.map((file) => file.location),
    });
  })
);

export default imageController;
