export type CreateItemDto = {
  name: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  userId: string;
};

export type UpdateItemDto = {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  tags?: string[];
};

export type GetItemDto = {
  id: string;
};
