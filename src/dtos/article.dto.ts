export type articleParamsDto = {
  articleId: string;
};

export type articleDto = {
  title: string;
  content: string;
};

export type articleQueryDto = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};
