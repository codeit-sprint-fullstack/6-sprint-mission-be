import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { signUpService } from "../services/user.service.js";

export const createUserController = asyncErrorHandler(
  async function (req, res, next) {
    // parse the request data
    const { email, nickname, password, passwordConfirmation } = req.body;

    // call service with the parsed info
    const newUser = await signUpService({
      email,
      nickname,
      password,
      passwordConfirmation,
    });

    // send response - created user info with access & refresh token
    res.status(201).json(
      {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        createdAt: newUser.createdAt,
      },
      accessToken,
      refreshToken
    );
  }
);
