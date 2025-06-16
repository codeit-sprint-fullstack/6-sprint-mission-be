import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

// 라우터들 import
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import productRouter from './routes/productRouter';
import articleRouter from './routes/articleRouter';
import commentRouter from './routes/commentRouter';

const app = express();

// ✅ CommonJS에서는 그냥 전역 __dirname 사용하면 됨
// const __filename = fileURLToPath(import.meta.url); ❌
// const __dirname = path.dirname(__filename);       ❌

const allowedOrigins = ['http://localhost:3000', 'https://your-frontend.com'];

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.use(express.json());

// 라우터 등록
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/', commentRouter);

// 루트 응답
app.get('/', (req: Request, res: Response) => {
    console.log('✅ 루트 요청 도착!');
    res.send('✅ 서버가 정상적으로 실행 중입니다!');
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
