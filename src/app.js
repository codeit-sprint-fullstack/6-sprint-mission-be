import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import articleRouter from './routes/articleRouter.js';
import commentRouter from './routes/commentRouter.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 글로벌 미들웨어 등록
const allowedOrigins = [
    'http://localhost:3000', // 개발 환경
    'https://your-frontend.com', // 배포 환경
];

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(express.json()); // JSON 바디 파싱

// 라우터 등록
app.use('/auth', authRouter); // 회원가입, 로그인
app.use('/users', userRouter); // 유저 정보 관련 (me 등)
app.use('/products', productRouter); // 상품 등록/수정/조회 등
app.use('/articles', articleRouter); // 게시글 등록/수정/조회 등
app.use('/', commentRouter); // 댓글 처리

// 에러 핸들러 등록

app.get('/', (req, res) => {
    console.log('✅ 루트 요청 도착!');
    res.send('✅ 서버가 정상적으로 실행 중입니다!');
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
export default app;
