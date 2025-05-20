import articleRepository from "../repositories/articleRepository.js";

// 게시글 목록 조회 (검색 및 페이지네이션)
async function getArticles({
  offset = 0,
  limit = 10,
  search,
  sort = "latest",
  userId = null,
}) {
  const skip = Number(offset);
  const take = Number(limit);

  const options = {
    skip,
    take,
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  // 정렬 옵션 설정
  if (sort === "popular") {
    // 인기순(좋아요 많은 순)으로 정렬
    options.orderBy = { likes: "desc" };
  } else {
    // 최신순으로 정렬 (기본값)
    options.orderBy = { createdAt: "desc" };
  }

  // 검색 조건 설정
  if (search) {
    options.where = {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
    };
  }

  // 전체 게시글 및 페이지네이션 데이터 fetch
  const [articles, total] = await Promise.all([
    articleRepository.findAll(options),
    articleRepository.count(options.where),
  ]);

  // ✅ 유저가 좋아요 누른 상품 ID 목록 조회
  let likedArticleIds = [];
  if (userId) {
    const likes = await articleRepository.findLikedArticleIdsByUser(
      userId,
      articles.map((p) => p.id)
    );

    likedArticleIds = likes.map((like) => like.articleId);
  }

  // ✅ products에 isLiked 필드 추가
  const articlesWithLike = articles.map((article) => {
    // user 객체 분리 (user 필드는 include에서 가져옴)
    const { user, ...articleData } = article;

    return {
      ...articleData,
      author: user, // 작성자 정보
      isLiked: likedArticleIds.includes(article.id),
    };
  });

  return {
    articles: articlesWithLike,
    pagination: {
      total,
      offset: skip,
      limit: take,
      hasMore: total > skip + take,
    },
    sort,
  };
}

// 특정 게시글 조회
async function getArticleById(id, userId) {
  const article = await articleRepository.findById(id, userId);

  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  const isLiked = userId ? article.ArticleLike.length > 0 : false;
  // ArticleLike와 user 객체 분리
  const { ArticleLike, user, ...rest } = article;

  return {
    ...rest,
    author: user, // 작성자 정보
    isLiked,
  };
}

// 새 게시글 작성
async function createArticle({ title, content, userId, image }) {
  return articleRepository.create({
    title,
    content,
    likes: 0,
    userId,
    image,
  });
}

// 게시글 수정
async function updateArticle(id, { title, content, image }) {
  try {
    return await articleRepository.update(id, { title, content, image });
  } catch (error) {
    if (error.code === "P2025") {
      const notFoundError = new Error("게시글을 찾을 수 없습니다.");
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw error;
  }
}

// 게시글 삭제
async function deleteArticle(id) {
  try {
    return await articleRepository.remove(id);
  } catch (error) {
    if (error.code === "P2025") {
      const notFoundError = new Error("게시글을 찾을 수 없습니다.");
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw error;
  }
}

// 특정 게시글 좋아요 증가
async function increaseLike(articleId) {
  try {
    // 현재 게시글 조회
    const article = await getArticleById(articleId);

    // 좋아요 수 증가
    return await articleRepository.update(articleId, {
      likes: (article.likes || 0) + 1,
    });
  } catch (error) {
    if (error.status === 404) {
      throw error;
    }
    throw error;
  }
}

export default {
  getArticleById,
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
  increaseLike,
};
