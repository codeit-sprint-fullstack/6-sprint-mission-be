import { UserSummaryDto } from "./user.dto";
import { ProductDto } from "./product.dto";
import { ArticleDto } from "./article.dto";

// 상품 좋아요 기본 정보를 전달하기 위한 DTO
export type ProductLikeDto = {
  id: string;
  userId: string;
  productId: string;
};

// 상품 좋아요 상세 정보를 사용자 및 상품 정보와 함께 전달하기 위한 DTO
export type ProductLikeWithDetailsDto = ProductLikeDto & {
  user: UserSummaryDto;
  product: ProductDto;
};

// 게시글 좋아요 기본 정보를 전달하기 위한 DTO
export type ArticleLikeDto = {
  id: string;
  userId: string;
  articleId: string;
};

// 게시글 좋아요 상세 정보를 사용자 및 게시글 정보와 함께 전달하기 위한 DTO
export type ArticleLikeWithDetailsDto = ArticleLikeDto & {
  user: UserSummaryDto;
  article: ArticleDto;
};
