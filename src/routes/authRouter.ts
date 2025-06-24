import express from 'express';
import * as authController from '../controllers/authController';
import { errorHandler } from '../middlewares/errorHandler';

const router = express.Router();

router.post('/signIn', errorHandler(authController.signIn));
router.post('/signUp', errorHandler(authController.signUp));
router.post('/refresh-token', errorHandler(authController.refreshAccessToken)); //
export default router;
