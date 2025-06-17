import { UserParamsDto, UserSummaryDto } from "./user.dto";

// 게시글 기본 정보를 전달하기 위한 DTO
export type ArticleDto = {
  id: string;
  title: string;
  content: string;
  images: string[];
  likes: number | null;
};

export type ArticleParamsDto = {
  id: string;
};

export type ArticleCreateDto = Omit<ArticleDto, "id" | "likes"> & {
  userId: UserParamsDto["id"];
};

// 게시글 상세 정보를 작성자 정보와 함께 전달하기 위한 DTO
export type ArticleWithUserDto = ArticleDto & {
  user: UserSummaryDto;
};
