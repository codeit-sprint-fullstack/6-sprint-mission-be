export type CreateArticleDto = {
  title: string;
  content: string;
  images: string[];
  userId: string;
};

export type UpdateArticleDto = {
  title: string;
  content: string;
  images?: string[];
};

export type GetArticleDto = {
  id: string;
};
