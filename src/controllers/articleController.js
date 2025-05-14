import articleService from "../services/articleService.js";

// 게시글 목록 불러오기
const getArticles = async (req, res, next) => {
  try {
    const [articles, totalCount] = await articleService.getArticles(req.query);

    res.status(200).json({ list: articles, totalCount });
  } catch (e) {
    next(e);
  }
};

// 게시글 상세조회
const getArticle = async (req, res, next) => {
  const articleId = Number(req.params.articleId);

  try {
    const article = await articleService.getArticle(userId, articleId);

    res.status(200).json(article);
  } catch (e) {
    next(e);
  }
};

// 게시글 작성
const createArticle = async (req, res, next) => {
  try {
    const newArticle = await articleService.createArticle(req.body);

    res.status(201).json(newArticle);
  } catch (e) {
    next(e);
  }
};

// 게시글 수정
const updateArticle = async (req, res, next) => {
  const articleId = Number(req.params.articleId);

  try {
    const updatedArticle = await articleService.updateArticle(
      articleId,
      req.body
    );

    res.status(200).json(updatedArticle);
  } catch (e) {
    next(e);
  }
};

// 게시글 삭제
const deleteArticle = async (req, res, next) => {
  const articleId = Number(req.params.articleId);

  try {
    await articleService.deleteArticle(articleId);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

// TODO: 게시글 상세조회, 게시글 좋아요, 게시글 좋아요 취소에 user 인증 미들웨어 달고, req.auth로 들어오는 user정보에서 id를 추출한 다음에 userId를 넘겨주기
// TODO: 게시글 좋아요 전체 갯수 알 수 있는 목록도 반환시키기
// 게시글 좋아요
const addlikeArticle = async (req, res, next) => {
  const articleId = Number(req.params.articleId);

  try {
    const like = await articleService.addlikeArticle(userId, articleId);

    res.status(200).json(like);
  } catch (e) {
    next(e);
  }
};

// 게시글 좋아요 취소
const cancelLikeArticle = async (req, res, next) => {
  const articleId = Number(req.params.articleId);

  try {
    const cancelLike = await articleService.cancelLikeArticle(
      userId,
      articleId
    );

    res.status(200).json(cancelLike);
  } catch (e) {
    next(e);
  }
};

export default {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  addlikeArticle,
  cancelLikeArticle,
};
