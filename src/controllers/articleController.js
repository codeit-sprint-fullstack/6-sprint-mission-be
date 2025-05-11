import articleService from "../service/articleService.js";
import articleLikeService from "../service/articleLikeService.js";

// 게시글 목록 조회
const getArticles = async (req, res, next) => {
  try {
    const { offset, limit, search, sort } = req.query;
    const userId = req.auth?.userId || null;

    const result = await articleService.getArticles({
      offset,
      limit,
      search,
      sort,
      userId,
    });

    res.status(200).json({
      data: result.articles,
      pagination: result.pagination,
      sort: result.sort,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회
const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.auth?.userId || null;
    const article = await articleService.getArticleById(articleId, userId);

    res.status(200).json({ data: article });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 게시글 생성
const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.auth.userId;

    const article = await articleService.createArticle({
      title,
      content,
      userId,
    });
    res
      .status(201)
      .json({ message: "게시글이 성공적으로 등록되었습니다.", data: article });
  } catch (error) {
    next(error);
  }
};

// 게시글 수정
const updateArticle = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content } = req.body;
    const article = await articleService.updateArticle(articleId, {
      title,
      content,
    });

    res.status(200).json({
      message: "게시글이 성공적으로 수정되었습니다.",
      data: article,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 게시글 삭제
const deleteArticle = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    await articleService.deleteArticle(articleId);

    res.status(200).json({
      message: "게시글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 좋아요 증가
const increaseLike = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const updatedArticle = await articleService.increaseLike(articleId);

    res.status(200).json({
      message: "게시글에 좋아요를 눌렀습니다.",
      data: updatedArticle,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 좋아요 누르기
const likeArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.auth.userId;

    const result = await articleLikeService.likeArticle(userId, articleId);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// 좋아요 취소
const unlikeArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.auth.userId;

    const result = await articleLikeService.unlikeArticle(userId, articleId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// 댓글 목록 조회
const getCommentsByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const comments = await articleService.getCommentsByArticleId(articleId);
    res.status(200).json({ data: comments });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 댓글 생성
const createComment = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { content } = req.body;
    const comment = await articleService.createComment(articleId, { content });

    res.status(201).json({
      message: "댓글이 성공적으로 등록되었습니다.",
      data: comment,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 댓글 수정
const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const comment = await articleService.updateComment(commentId, { content });

    res.status(200).json({
      message: "댓글이 성공적으로 수정되었습니다.",
      data: comment,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 댓글 삭제
const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    await articleService.deleteComment(commentId);

    res.status(200).json({
      message: "댓글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default {
  getArticleById,
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
  increaseLike,
  likeArticle,
  unlikeArticle,
  getCommentsByArticleId,
  createComment,
  updateComment,
  deleteComment,
};
