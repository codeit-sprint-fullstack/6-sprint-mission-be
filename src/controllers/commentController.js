import commentService from "../services/commentService";

// 게시글 댓글 불러오기
const getComments = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    const articleComments = await commentService.getComments(
      articleId,
      req.query
    );

    res.json(articleComments);
  } catch (e) {
    next(e);
  }
};

export default {
  getComments,
};
