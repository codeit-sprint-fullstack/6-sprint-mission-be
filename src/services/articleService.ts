import { BadRequestError } from "../types/exceptions";
import articleRepository from "../repositories/articleRepository";
import { Article, User } from "@prisma/client";
import { GetListInput } from "../types";

async function getArticles({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword,
}: GetListInput) {
  const offset = (page - 1) * pageSize;
  const options = { skip: offset, take: pageSize, orderBy: {}, where: {} };

  if (orderBy === "recent") {
    options.orderBy = { createdAt: "desc" };
  } else if (orderBy === "like") {
    options.orderBy = { likeCount: "desc" };
  }
  if (keyword) {
    options.where = {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }
  return articleRepository.findAll(options);
}

async function createArticle(
  data: Pick<Article, "title" | "content">,
  writerId: Article["writerId"]
) {
  return articleRepository.save(data, writerId);
}

async function getArticle(articleId: Article["id"], userId: User["id"]) {
  return articleRepository.findById(articleId, userId);
}

async function updateArticle(
  articleId: Article["id"],
  data: Pick<Article, "title" | "content">
) {
  try {
    return await articleRepository.update(articleId, data);
  } catch (error) {
    throw error;
  }
}

async function deleteArticle(articleId: Article["id"]) {
  try {
    return await articleRepository.remove(articleId);
  } catch (error) {
    throw error;
  }
}

async function likeArticle(articleId: Article["id"], userId: User["id"]) {
  try {
    const alreadyLike = await articleRepository.findLike(articleId, userId);
    if (alreadyLike) {
      throw new BadRequestError("이미 좋아요한 게시글입니다.");
    }
    return await articleRepository.createLike(articleId, userId);
  } catch (error) {
    throw error;
  }
}

async function unlikeArticle(articleId: Article["id"], userId: User["id"]) {
  try {
    const alreadyLike = await articleRepository.findLike(articleId, userId);
    if (!alreadyLike) {
      throw new BadRequestError("좋아요하지 않은 게시글입니다.");
    }
    return await articleRepository.deleteLike(articleId, userId);
  } catch (error) {
    throw error;
  }
}

export default {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
