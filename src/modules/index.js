import express from 'express';
import productsRouter from './products.js';
import articlesRouter from './articles.js';

const indexRouter = express.Router();

indexRouter.use('/products', productsRouter);
indexRouter.use('/articles', articlesRouter);

export default indexRouter;
