import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import {
  create,
  remove,
  getByUser,
} from '../controllers/favorite.controller.js';

const favoriteRouter = express.Router();

favoriteRouter.post('/', verifyToken, create);
favoriteRouter.delete('/', verifyToken, remove); 
favoriteRouter.get('/user', verifyToken, getByUser);

export default favoriteRouter;
