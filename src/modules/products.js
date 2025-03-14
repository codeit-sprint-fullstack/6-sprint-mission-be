import express from 'express';
import { Product } from '../../models/Product.js';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const { offset = 0, limit = 10, sort = 'recent', keyword = '' } = req.query;

  const sortOption = {
    createdAt: sort === 'recent' ? 'desc' : 'asc',
  };

  const searchCondition = keyword
    ? {
        name: {
          $regex: keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find(searchCondition)
    .limit(limit)
    .skip(offset)
    .sort(sortOption);

  res.status(200).send(products);
});

productsRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).send({ message: 'Product not found' });
  }

  res.status(200).send(product);
});

productsRouter.post('/registration', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.patch('/update/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.delete('/delete/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.send({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

export default productsRouter;
