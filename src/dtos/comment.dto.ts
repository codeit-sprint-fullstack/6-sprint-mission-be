import { UserSummaryDto } from "./user.dto";

// 댓글 기본 정보를 전달하기 위한 DTO
export type CommentDto = {
  id: string;
  content: string;
  articleId: string | null;
  productId: string | null;
  userId: string;
};

export type CommentParamsDto = {
  id: string;
};

export type CommentCreateDto = Pick<CommentDto, "content" | "userId"> &
  Partial<Pick<CommentDto, "articleId" | "productId">>;

// 댓글 상세 정보를 작성자 정보와 함께 전달하기 위한 DTO
export type CommentWithUserDto = CommentDto & {
  user: UserSummaryDto;
};
