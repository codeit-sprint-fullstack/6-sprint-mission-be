export interface LikeResponseDto {
  id: number;
  userId: string;
  articleId?: number | null;
  productId?: number | null;
  createdAt: Date;
  updatedAt: Date;
} 