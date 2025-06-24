export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  images: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  images: string[];
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  images?: string[];
} 