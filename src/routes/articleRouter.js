import express from 'express';
import * as articleController from '../controllers/articleController.js';
import {  errorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

router.post('/', errorHandler(articleController.createArticle));
router.get('/', errorHandler(articleController.getArticles));
router.get('/:articleId', errorHandler(articleController.getArticle));
router.patch('/:articleId', errorHandler(articleController.updateArticle));
router.delete('/:articleId', errorHandler(articleController.deleteArticle));
router.post('/:articleId/comments', errorHandler(articleController.createComment));
router.get('/:articleId/comments', errorHandler(articleController.listComments));

export default router;
