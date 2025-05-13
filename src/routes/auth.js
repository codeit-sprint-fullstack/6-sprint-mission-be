import express from "express";
import { signUpController } from "../controllers/auth.js";
import { validateRequest } from "../middlewares/validation.js"; // Assuming you have a validation middleware
import { CreateUserRequestStruct } from "../structs/user/CreateUserRequestStruct.js";

const router = express.Router();

router.post(
  "/signUp",
  validateRequest(CreateUserRequestStruct),
  signUpController
);

export default router;
