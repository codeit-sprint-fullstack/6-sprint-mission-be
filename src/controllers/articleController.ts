import { Request, Response } from 'express';
import * as articleService from '../services/articleService.js';

export const createArticle = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = req.userId; // 로그인된 유저 ID
    const article = await articleService.createArticle({ title, content }, userId!);
    res.status(201).json(article);
};

export const getArticle = async (req: Request, res: Response) => {
    const article = await articleService.getArticle(Number(req.params.articleId));
    res.json(article);
};

export const updateArticle = async (req: Request, res: Response) => {
    const { title, content } = req.body;

    const article = await articleService.updateArticle(Number(req.params.articleId), {
        title,
        content,
    });

    res.json(article);
};
export const deleteArticle = async (req: Request, res: Response) => {
    await articleService.deleteArticle(Number(req.params.articleId));
    res.status(204).send();
};

export const getArticles = async (req: Request, res: Response) => {
    const { page = '1', pageSize = '10', keyword, orderBy } = req.query;

    const articles = await articleService.getArticles({
        cursor: parseInt(page as string, 10),
        take: parseInt(pageSize as string, 10),
        word: keyword as string | undefined,
        orderBy: orderBy as string | undefined,
    });

    res.json(articles);
};

// export const createComment = async (req: Request, res: Response) => {
//     const { content } = req.body;
//     const comment = await articleService.createComment(Number(req.params.articleId), content);
//     res.status(201).json(comment);
// };

// export const listComments = async (req, res) => {
//     const comments = await articleService.listComments(Number(req.params.articleId), req.query);
//     res.json(comments);
// };

export const toggleLike = async (req: Request, res: Response) => {
    const userId = req.userId;
    const articleId = Number(req.params.articleId);
    const result = await articleService.toggleLike(articleId, userId!);
    res.status(200).json({
        message: result.liked ? '좋아요 추가됨' : '좋아요 취소됨',
    });
};
