import express from "express";
import { validateRequest } from "../middlewares/validation.js"; // Assuming you have a validation middleware
import { CreateUserRequestStruct } from "../structs/user/CreateUserRequestStruct.js";
import { createUserController } from "../controllers/users.js";

const router = express.Router();

router.post(
  "/users",
  validateRequest(CreateUserRequestStruct),
  createUserController
);

export default router;
