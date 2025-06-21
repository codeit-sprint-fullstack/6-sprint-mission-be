export type CreateCommentDto = {
  content: string;
  articleId?: string;
  itemId?: string;
  userId: string;
};

export type UpdateCommentDto = {
  content: string;
};

export type GetCommentDto = {
  id: string;
};
