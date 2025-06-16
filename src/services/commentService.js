import commentRepository from "../repositories/commentRepository";

// 게시글 댓글 불러오기
const getComments = async (articleId, query) => {
  const { cursor } = query;

  const articleCommentId = await commentRepository.findByCursor(
    articleId,
    cursor
  );

  const articleComments = await commentRepository.findAll(
    query,
    articleId,
    articleCommentId
  );

  return articleComments;
};

export default {
  getComments,
};
