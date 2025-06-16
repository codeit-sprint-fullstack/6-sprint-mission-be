export type productParamsDto = {
  productId: string;
};

export type productDto = {
  name: string;
  description: string;
  price: string;
  tags: string;
};

export type productQueryDto = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};
