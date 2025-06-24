import express, { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import auth from "../middlewares/auth";
import { User } from "@prisma/client";
import { ValidationError } from "../types/errors";

const userController = express.Router();

userController.get(
  "/me",
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).auth?.id;
      if (!userId) {
        res.status(401).json({ message: "로그인이 필요합니다." });
        return;
      }
      const user = await userService.getMe(userId);

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

userController.post(
  "/users",
  async (
    req: Request<{}, {}, Pick<User, "email" | "name" | "password">>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name, password } = req.body;
      if (!email || !name || !password) {
        const error = new ValidationError(
          "email, name, password가 모두 필요합니다."
        );
        throw error;
      }

      const user = await userService.createUser({ email, name, password });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

userController.post(
  "/login",
  async (req: Request<{}, {}, Pick<User, "email" | "password">>, res, next) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        const error = new ValidationError("email, password가 모두 필요합니다.");
        throw error;
      }

      const user = await userService.getUser(email, password);
      const accessToken = userService.createToken(user);
      const refreshToken = userService.createToken(user, "refresh");

      await userService.updateUser(user.id, { refreshToken });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.json({ ...user, accessToken });
    } catch (error) {
      next(error);
    }
  }
);

userController.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken as string;
      const userId = (req as any).auth!.id;

      const { newAccessToken, newRefreshToken } =
        await userService.refreshToken(userId, refreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/token/refresh",
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
