import {
  User,
  Article,
  Product,
  Comment,
  ArticleLike,
  ProductLike,
} from "@prisma/client";

// 기본 타입들
export type CreateUserInput = Pick<User, "email" | "name" | "password"> & {
  profileImageUrl?: string;
};

export type UpdateUserInput = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;

export type CreateArticleInput = {
  title: string;
  content: string;
  image?: string | null;
  authorId: number;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  image?: string | null;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  images?: string | null;
  authorId: number;
};

export type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string | null;
};

export type CreateCommentInput = {
  content: string;
  authorId: number;
  articleId?: number | null;
  productId?: number | null;
};

// Repository 함수 타입들
export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createdUser(user: CreateUserInput): Promise<User>;
  updateUser(id: number, data: UpdateUserInput): Promise<User>;
}

export interface ArticleRepository {
  createArticle(article: CreateArticleInput): Promise<Article>;
  getById(id: number): Promise<any>;
  getAll(): Promise<any[]>;
  updateById(id: number, article: UpdateArticleInput): Promise<Article>;
  deleteById(id: number): Promise<Article>;
  addLike(userId: number, articleId: number): Promise<void>;
  removeLike(userId: number, articleId: number): Promise<void>;
  hasUserLiked(userId: number, articleId: number): Promise<boolean>;
}

export interface ProductRepository {
  createProduct(product: CreateProductInput): Promise<Product>;
  getById(id: number): Promise<any>;
  getAll(): Promise<any[]>;
  updateById(id: number, product: UpdateProductInput): Promise<Product>;
  deleteById(id: number): Promise<Product>;
  addLike(userId: number, productId: number): Promise<void>;
  removeLike(userId: number, productId: number): Promise<void>;
  hasUserLiked(userId: number, productId: number): Promise<boolean>;
}

export interface CommentRepository {
  createComment(commentData: CreateCommentInput): Promise<any>;
  getCommentsByArticleId(articleId: number): Promise<any[]>;
  getCommentsByProductId(productId: number): Promise<any[]>;
  getById(commentId: number): Promise<any>;
  updateComment(commentId: number, newContent: string): Promise<Comment>;
  deleteComment(commentId: number): Promise<Comment>;
}

// Service 함수 타입들
export interface UserService {
  getMe(userId: number): Promise<Omit<User, "password" | "refreshToken">>;
  createUser(
    user: CreateUserInput
  ): Promise<Omit<User, "password" | "refreshToken">>;
  getUser(
    email: string,
    password: string
  ): Promise<Omit<User, "password" | "refreshToken">>;
  createToken(
    user: Omit<User, "password" | "refreshToken">,
    type?: "access" | "refresh"
  ): string;
  updateUser(id: number, data: UpdateUserInput): Promise<User>;
  refreshToken(
    userId: number,
    refreshToken: string
  ): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
  }>;
}

export interface ArticleService {
  create(article: CreateArticleInput): Promise<Article>;
  getById(id: number): Promise<any>;
  getAll(): Promise<any[]>;
  updateById(id: number, article: UpdateArticleInput): Promise<Article>;
  deleteById(id: number): Promise<Article>;
  addLike(userId: number, articleId: number): Promise<void>;
  removeLike(userId: number, articleId: number): Promise<void>;
  hasUserLiked(userId: number, articleId: number): Promise<boolean>;
}

export interface ProductService {
  create(product: CreateProductInput): Promise<Product>;
  getById(id: number): Promise<any>;
  getAll(): Promise<any[]>;
  updateById(id: number, product: UpdateProductInput): Promise<Product>;
  deleteById(id: number): Promise<Product>;
  addLike(userId: number, productId: number): Promise<void>;
  removeLike(userId: number, productId: number): Promise<void>;
  hasUserLiked(userId: number, productId: number): Promise<boolean>;
}

export interface CommentService {
  create(commentData: CreateCommentInput): Promise<any>;
  getByArticleId(articleId: number): Promise<any[]>;
  getByProductId(productId: number): Promise<any[]>;
  update(commentId: number, newContent: string): Promise<Comment>;
  deleteById(commentId: number): Promise<Comment>;
}
