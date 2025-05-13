import { ARTICLE_NOT_FOUND } from "../constant.js";
import { BadRequestError, NotFoundError } from "../exceptions.js";
import articleRepository from "../repositories/articleRepository.js";

async function getArticles({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword,
}) {
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

async function createArticle(data, writerId) {
  return articleRepository.save(data, writerId);
}

async function getArticle(articleId, userId) {
  return articleRepository.findById(articleId, userId);
}

async function updateArticle(articleId, data) {
  try {
    return await articleRepository.update(articleId, data);
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError(ARTICLE_NOT_FOUND);
    }
    throw e;
  }
}

async function deleteArticle(articleId) {
  try {
    return await articleRepository.remove(articleId);
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError(ARTICLE_NOT_FOUND);
    }
    throw e;
  }
}

async function likeArticle(articleId, userId) {
  try {
    const alreadyLike = await articleRepository.findLike(articleId, userId);
    if (alreadyLike) {
      throw new BadRequestError("이미 좋아요한 게시글입니다.");
    }
    return await articleRepository.createLike(articleId, userId);
  } catch (e) {
    if (e.code === "P2003") {
      throw new NotFoundError(ARTICLE_NOT_FOUND);
    }
    throw e;
  }
}

async function unlikeArticle(articleId, userId) {
  try {
    const alreadyLike = await articleRepository.findLike(articleId, userId);
    if (!alreadyLike) {
      throw new BadRequestError("좋아요하지 않은 게시글입니다.");
    }
    return await articleRepository.deleteLike(articleId, userId);
  } catch (e) {
    if (e.code === "P2003") {
      throw new NotFoundError(ARTICLE_NOT_FOUND);
    }
    throw e;
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
