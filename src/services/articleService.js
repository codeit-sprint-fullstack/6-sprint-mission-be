import articleRepository from '../repositories/articleRepository.js';

const articleService = {
  createArticle: async (userId, title, content, images) => {
    return articleRepository.createArticle(userId, title, content, images);
  },

  getArticles: async () => {
    return articleRepository.findAllArticles();
  },

  getArticleById: async (id) => {
    const article = await articleRepository.findArticleById(id);
    if (!article) {
      throw { status: 404, message: '게시글을 찾을 수 없습니다.' };
    }
    return article;
  },

  updateArticle: async (id, userId, title, content, images) => {
    const article = await articleRepository.findArticleById(id);
    if (!article) {
      throw { status: 404, message: '게시글을 찾을 수 없습니다.' };
    }
    if (article.userId !== userId) {
      throw { status: 403, message: '게시글 수정 권한이 없습니다.' };
    }
    return articleRepository.updateArticle(id, title, content, images);
  },

  deleteArticle: async (id, userId) => {
    const article = await articleRepository.findArticleById(id);
    if (!article) {
      throw { status: 404, message: '게시글을 찾을 수 없습니다.' };
    }
    if (article.userId !== userId) {
      throw { status: 403, message: '게시글 삭제 권한이 없습니다.' };
    }
    return articleRepository.deleteArticle(id);
  },
};

export default articleService;