import * as articleService from '../services/articleService.js';

export const createArticle = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId; // 로그인된 유저 ID
    console.log('컨트롤러에서 유저아이디:', req.user);
    const article = await articleService.createArticle({ title, content }, userId);
    res.status(201).json(article);
};

export const getArticle = async (req, res) => {
    const article = await articleService.getArticle(Number(req.params.articleId));
    res.json(article);
};

export const updateArticle = async (req, res) => {
    const { title, content } = req.body;
    const article = await articleService.updateArticle(Number(req.params.articleId), {
        title,
        content,
    });
    res.json(article);
};

export const deleteArticle = async (req, res) => {
    await articleService.deleteArticle(Number(req.params.articleId));
    res.status(204).send();
};

export const getArticles = async (req, res) => {
    const articles = await articleService.getArticles(req.query);
    res.json(articles);
};

export const createComment = async (req, res) => {
    const { content } = req.body;
    const comment = await articleService.createComment(Number(req.params.articleId), content);
    res.status(201).json(comment);
};

export const listComments = async (req, res) => {
    const comments = await articleService.listComments(Number(req.params.articleId), req.query);
    res.json(comments);
};
