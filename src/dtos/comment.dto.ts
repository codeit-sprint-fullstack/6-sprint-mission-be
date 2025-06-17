export interface CommentResponseDto {
  id: number;
  content: string;
  userId: string;
  articleId?: number | null;
  productId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentDto {
  content: string;
  articleId?: number;
  productId?: number;
}

export interface UpdateCommentDto {
  content?: string;
} 