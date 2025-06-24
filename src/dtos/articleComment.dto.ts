export type ArticleCommentParamsDto = {
  articleId: string;
  commentId: string;
};

export type ArticleCommentDto = {
  content: string;
};

export type ArticleCommentQueryDto = {
  limit: string;
  cursor: string;
};
