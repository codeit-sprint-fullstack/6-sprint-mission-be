import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './src/modules/index.js';

dotenv.config();

const app = express();

// 허용할 출처(도메인)들의 목록
const whitelist = ['https://6-sprint-mission-fe.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // origin: 요청을 보낸 출처(도메인)
    // callback: 응답을 처리할 함수

    if (!origin || whitelist.indexOf(origin) !== -1) {
      // whitelist에 요청 출처가 있으면
      callback(null, true); // 허용 (첫번째 인자: 에러, 두번째 인자: 허용 여부)
    } else {
      // whitelist에 요청 출처가 없으면
      callback(new Error('Not Allowed Origin!')); // 거부
    }
  },
  credentials: true, // 필요한 경우 추가
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', async (req, res) => {
  res.send('서버가 연결되었습니다!');
});

app.use(indexRouter);

app.use((err, req, res, next) => {
  console.log(err.name);

  switch (err.name) {
    case 'ValidationError':
      res
        .status(400)
        .send({ message: 'ValidationError : body의 내용이 빠졌습니다!' });
      break;
    case 'CastError':
      res.status(400).send({ message: 'Invalid product ID' });
      break;
    default:
      res.status(500).send({ message: e.message });
  }

  next();
});

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log('Connected to MongoDB');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
