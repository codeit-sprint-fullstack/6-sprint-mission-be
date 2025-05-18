import express from "express";
import { validateRequest } from "../middlewares/validation.js";
import { CreateUserRequestStruct } from "../structs/user/CreateUserRequestStruct.js";
import { createUserController } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/users",
  validateRequest(CreateUserRequestStruct),
  createUserController()
);

export default router;
