import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; 
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';



const app = express();
const PORT = process.env.BE_PORT || 5050;
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const FE_PORT = `http://localhost:${HTTP_PORT}`

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 개발 단계에선 모든 경로 허용.
app.use(cors());

// app.use(cors({
//   origin: FE_PORT,  // 허용할 프론트엔드 주소 설정
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(morgan('dev')); 
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`)
})