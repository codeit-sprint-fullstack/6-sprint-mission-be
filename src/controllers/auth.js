import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { loginService } from "../services/auth.js";

export const loginController = asyncErrorHandler(
  async function (req, res, next) {
    const { email, password } = req.body;
    const result = await loginService({ email, password });

    res.status(200).json(result);
  }
);
