import { Article, User, Comment } from "@prisma/client";
import prisma from "../config/client.prisma.js";

async function save(article: Article): Promise<Article> {
  const createArticle = await prisma.article.create({
    data: {
      image: article.image,
      content: article.content,
      title: article.title,
    },
  });
  return createArticle;
}

async function getById(articleId: Article["id"], userId: User["id"]) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      favorites: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  if (!article) return null;
  return { ...article, isLiked: article.favorites.length > 0 };
}

async function getAll() {
  const articles = await prisma.article.findMany();
  return articles;
}

async function update(id: Article["id"], article: Article) {
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      image: article.image,
      content: article.content,
      title: article.title,
    },
  });
  return updatedArticle;
}

async function deleteById(id: Article["id"]) {
  return await prisma.article.delete({
    where: {
      id,
    },
  });
}

async function saveArticleComment(comment: Comment) {
  return await prisma.comment.create({
    data: {
      content: comment.content,
      articleId: comment.articleId,
      authorId: comment.authorId,
    },
  });
}

async function getAllArticleComment(articleId: Article["id"]) {
  return await prisma.comment.findMany({
    where: {
      articleId: articleId,
    },
  });
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
  saveArticleComment,
  getAllArticleComment,
};
