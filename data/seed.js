import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { productsMockData } from './mock.js';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(productsMockData);

mongoose.connection.close();
