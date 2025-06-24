export type ProductCommentParamsDto = {
  productId: string;
  commentId: string;
};

export type ProductCommentDto = {
  content: string;
};

export type ProductCommentQueryDto = {
  limit: string;
  cursor: string;
};
