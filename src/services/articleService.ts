import { Article, User } from "@prisma/client";
import articleRepository from "../repositories/articleRepository";

async function createArticle(
  article: Pick<Article, "title" | "content" | "images" | "userId">
) {
  try {
    const createdArticle = await articleRepository.save(article);
    return createdArticle;
  } catch (error) {
    throw error;
  }
}

async function getById(id: Article["id"], userId: User["id"]) {
  return await articleRepository.getById(id, userId);
}

async function getArticles(keyword: string, orderBy: "recent" | "favorite") {
  const options: any = {};
  if (orderBy === "recent") {
    options.orderBy = { createdAt: "desc" };
  } else {
    options.orderBy = { favoriteCount: "desc" };
  }

  if (keyword) {
    options.where = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }
  return await articleRepository.getByOptions(options);
}

async function patchArticle(
  id: Article["id"],
  article: Partial<Pick<Article, "title" | "content" | "images">>
) {
  try {
    const updatedArticle = await articleRepository.edit(id, article);
    return updatedArticle;
  } catch (error) {
    throw error;
  }
}

async function deleteArticle(id: Article["id"]) {
  try {
    const deletedArticle = await articleRepository.remove(id);
    return deletedArticle;
  } catch (error) {
    throw error;
  }
}

async function postFavorite(id: Article["id"], userId: User["id"]) {
  try {
    const createdFavorite = await articleRepository.createFavorite(id, userId);
    return createdFavorite;
  } catch (error) {
    throw error;
  }
}

async function deleteFavorite(id: Article["id"], userId: User["id"]) {
  try {
    const deletedFavorite = await articleRepository.removeFavorite(id, userId);
    return deletedFavorite;
  } catch (error) {
    throw error;
  }
}

export default {
  createArticle,
  getById,
  deleteArticle,
  getArticles,
  patchArticle,
  postFavorite,
  deleteFavorite,
};
