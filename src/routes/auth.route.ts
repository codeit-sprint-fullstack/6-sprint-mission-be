import express, { Router, RequestHandler } from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const router: Router = express.Router();

router.post("/signup", signup as unknown as RequestHandler);
router.post("/signin", signin as unknown as RequestHandler);

export default router; 