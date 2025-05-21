import prisma from "../config/client.prisma.js";

async function save(article) {
  const createArticle = await prisma.article.create({
    data: {
      image: article.image,
      content: article.content,
      title: article.title,
    },
  });
  return createArticle;
}

async function getById(articleId, userId) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      favorites: {
        where: { userId },
        select: { id: true },
      },
    },
  });
  return { ...article, isLiked: article.favorites.length > 0 };
}

async function getAll() {
  const articles = await prisma.article.findMany();
  return articles;
}

async function update(id, article) {
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      image: article.imgage,
      content: article.content,
      title: article.title,
    },
  });
  return updatedArticle;
}

async function deleteById(id) {
  return await prisma.article.delete({
    where: {
      id,
    },
  });
}

async function saveArticleComment(comment) {
  return await prisma.comment.create({
    data: {
      content: comment.content,
      articleId: comment.articleId,
      authorId: comment.authorId,
    },
  });
}

async function getAllArticleComment(articleId) {
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
