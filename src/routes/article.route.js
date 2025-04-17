import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ✅ GET /article (전체 게시글 목록)
router.get('/', async (req, res) => {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(articles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '게시글 조회 실패' });
    }
});

// ✅ GET /article/:id (게시글 상세)
router.get('/:id', async (req, res) => {
    try {
        const article = await prisma.article.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!article) return res.status(404).json({ message: '없음' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: '상세 조회 실패' });
    }
});

export default router;
