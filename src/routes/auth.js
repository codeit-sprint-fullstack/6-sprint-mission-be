import express from "express";
import { loginController } from "../controllers/auth.js";
import { validateRequest } from "../middlewares/validation.js";
import { LoginRequestStruct } from "../structs/auth/LoginRequestStruct.js"; // You'll need to create this struct

const router = express.Router();

router.post("/login", validateRequest(LoginRequestStruct), loginController);

export default router;
