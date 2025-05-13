import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { signUpService } from "../services/users.js";

export const createUserController = asyncErrorHandler(
  async function (req, res, next) {
    const { email, nickname, password, passwordConfirmation } = req.body;

    const newUser = await signUpService({
      email,
      nickname,
      password,
      passwordConfirmation,
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt,
    });
  }
);
