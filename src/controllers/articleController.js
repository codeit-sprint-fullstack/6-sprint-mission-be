import articleService from '../services/articleService.js';

const articleController = {
  createArticle: async (req, res, next) => {
    try {
      const { title, content, images } = req.body;
      const userId = req.auth.id;  
      const newArticle = await articleService.createArticle(userId, title, content, images);
      return res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  },

  getArticles: async (req, res, next) => {
    try {
      const { page = 1, pageSize: limit = 10, orderBy: sort = 'recent', keyword: search } = req.query;
      const articles = await articleService.getArticles(sort, search, parseInt(page), parseInt(limit));
      return res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  },

  getArticleById: async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const article = await articleService.getArticleById(parseInt(articleId));
      return res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  },

  updateArticle: async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const { title, content, images } = req.body;
      const userId = req.auth.id;  
      const updatedArticle = await articleService.updateArticle(
        parseInt(articleId),
        userId,
        title,
        content,
        images
      );
      return res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  },

  deleteArticle: async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const userId = req.auth.id;  
      await articleService.deleteArticle(parseInt(articleId), userId);
      return res.status(204).send();   
    } catch (error) {
      next(error);
    }
  },
};

export default articleController;