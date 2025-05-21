import express from 'express';
import * as authController from '../controllers/authController.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

router.post('/signIn', errorHandler(authController.signIn));
router.post('/signUp', errorHandler(authController.signUp));
router.post('/refresh-token', errorHandler(authController.refreshAccessToken)); //
export default router;
