import { Article, User, Comment } from "@prisma/client";
import articleRepository from "../repositories/articleRepository";
import { ArticleBodyDTO, ArticlePatchDTO } from "../dto/article.dto";
import { CommentBody, CommentBodyDTO } from "../dto/comment.dto";

async function create(article: ArticleBodyDTO) {
  return articleRepository.save(article);
}

async function getById(articleId: Article["id"], userId: User["id"]) {
  return articleRepository.getById(articleId, userId);
}

async function getAll() {
  return articleRepository.getAll();
}

async function update(id: Article["id"], review: ArticlePatchDTO) {
  return articleRepository.update(id, review);
}

async function deleteById(id: Article["id"]) {
  return articleRepository.deleteById(id);
}

async function createArticleComment(
  comment: CommentBodyDTO & { articleId: number; authorId: number }
) {
  return articleRepository.saveArticleComment(comment);
}

async function getAllArticleComment(id: Article["id"]) {
  return articleRepository.getAllArticleComment(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
  createArticleComment,
  getAllArticleComment,
};
