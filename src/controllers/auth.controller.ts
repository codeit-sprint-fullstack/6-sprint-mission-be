import { Response, NextFunction } from "express";
import authService from "../services/auth.service";
import {
  AuthRequest,
  UserCreateRequest,
  UserLoginRequest,
} from "../Types/user";

const authController = {
  signup: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, nickname } = req.body as UserCreateRequest;
      const result = await authService.signup(email, password, nickname);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
      return;
    }
  },

  login: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as UserLoginRequest;
      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
      return;
    }
  },

  refreshToken: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
      return;
    }
  },
};

export default authController;
