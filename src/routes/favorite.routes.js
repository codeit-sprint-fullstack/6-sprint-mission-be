// routes/favorite.route.js
import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import * as favoriteController from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/', verifyToken, favoriteController.create);
router.delete('/', verifyToken, favoriteController.remove);
router.get('/user', verifyToken, favoriteController.getByUser); 

export default router;
