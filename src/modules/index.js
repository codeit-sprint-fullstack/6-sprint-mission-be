import express from 'express';
import productsRouter from './products.js';

const indexRouter = express.Router();

indexRouter.use('/products', productsRouter);

export default indexRouter;
