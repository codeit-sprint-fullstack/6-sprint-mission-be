import articleRepository from '../repositories/article.repository';
import { ArticleResponseDto, CreateArticleDto, UpdateArticleDto } from '../Types/article';

const articleService = {
  createArticle: async (userId: string, title: string, content: string, images: string[]): Promise<ArticleResponseDto> => {
    return articleRepository.createArticle(userId, title, content, images);
  },

  getArticles: async (
    sort: string,
    search: string | undefined,
    page: number,
    limit: number
  ): Promise<ArticleResponseDto[]> => {
    const skip = (page - 1) * limit;
    const articles = await articleRepository.findAllArticles(sort, search, skip, limit);
    return articles;
  },

  getArticleById: async (id: number): Promise<ArticleResponseDto> => {
    const article = await articleRepository.findArticleById(id);
    if (!article) {
      throw { status: 404, message: '게시글을 찾을 수 없습니다.' };
    }
    return article;
  },

  updateArticle: async (
    id: number,
    userId: string,
    title: string,
    content: string,
    images: string[]
  ): Promise<ArticleResponseDto> => {
    const article = await articleRepository.findArticleById(id);
    if (!article) {
      throw { status: 404, message: '게시글을 찾을 수 없습니다.' };
    }
    if (article.userId !== userId) {
      throw { status: 403, message: '게시글 수정 권한이 없습니다.' };
    }
    return articleRepository.updateArticle(id, title, content, images);
  },

  deleteArticle: async (id: number, userId: string): Promise<void> => {
    const article = await articleRepository.findArticleById(id);
    if (!article) {
      throw { status: 404, message: '게시글을 찾을 수 없습니다.' };
    }
    if (article.userId !== userId) {
      throw { status: 403, message: '게시글 삭제 권한이 없습니다.' };
    }
    await articleRepository.deleteArticle(id);
  },
};

export default articleService; 