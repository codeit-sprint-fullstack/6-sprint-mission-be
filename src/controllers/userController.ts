import express, { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import { AuthenticationError } from "../types/error";
import { User } from "@prisma/client";

const userController = express.Router();

userController.post(
  "/auth/signUp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, nickName, password } = req.body;
      if (!email || !nickName || !password) {
        throw new AuthenticationError(
          "failed to authenticate, you need email, nickname and password"
        );
      }
      const user = await userService.createUser({
        email,
        nickName,
        encryptedPassword: password,
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

userController.post(
  "/auth/signIn",
  async (
    req: Request<{}, {}, Pick<User, "email" | "password">>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new AuthenticationError(
          "failed to authenticate, you need email and password"
        );
      }
      const user = await userService.getUser(
        email,
        inputPassword:password
      );
      const accessToken = userService.createToken(user);
      res.json({ ...user, accessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
