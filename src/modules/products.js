import express from 'express';
import { Product } from '../../models/Product.js';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const {
    page = 0,
    pageSize = 10,
    orderBy = 'recent',
    keyWord = '',
  } = req.query;

  const sortOption = {
    createdAt: orderBy === 'recent' ? 'desc' : 'asc',
  };

  const searchCondition = keyWord
    ? {
        name: {
          $regex: keyWord,
          $options: 'i',
        },
      }
    : {};

  console.log(keyWord);

  const productsList = await Product.find(searchCondition)
    .limit(pageSize)
    .skip(page)
    .sort(sortOption);

  const produtcsTotalCount = (await Product.find(searchCondition)).length;

  res.status(200).send({ list: productsList, totalCount: produtcsTotalCount });
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

    console.log(product);

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
