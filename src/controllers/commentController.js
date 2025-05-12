import commentService from "../service/commentService.js";

// 게시글 댓글 목록 조회
const getCommentsByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const comments = await commentService.getCommentsByArticleId(articleId);
    res.status(200).json({ data: comments });
  } catch (error) {
    next(error);
  }
};

// 게시글 댓글 생성
const createArticleComment = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.auth.userId;
    const { content } = req.body;

    const comment = await commentService.createArticleComment(
      articleId,
      userId,
      { content }
    );

    res.status(201).json({
      message: "댓글이 성공적으로 등록되었습니다.",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// 상품 댓글 목록 조회
const getCommentsByProductId = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const comments = await commentService.getCommentsByProductId(productId);
    res.status(200).json({ data: comments });
  } catch (error) {
    next(error);
  }
};

// 상품 댓글 생성
const createProductComment = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.auth.userId;
    const { content } = req.body;

    const comment = await commentService.createProductComment(
      productId,
      userId,
      { content }
    );

    res.status(201).json({
      message: "댓글이 성공적으로 등록되었습니다.",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// 댓글 수정
const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.auth.userId;
    const { content } = req.body;

    const comment = await commentService.updateComment(commentId, userId, {
      content,
    });

    res.status(200).json({
      message: "댓글이 성공적으로 수정되었습니다.",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// 댓글 삭제
const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.auth.userId;

    await commentService.deleteComment(commentId, userId);

    res.status(200).json({
      message: "댓글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCommentsByArticleId,
  getCommentsByProductId,
  createArticleComment,
  createProductComment,
  updateComment,
  deleteComment,
};
