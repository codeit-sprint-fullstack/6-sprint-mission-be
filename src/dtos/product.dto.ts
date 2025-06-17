import { UserParamsDto } from "./user.dto";

// 상품 기본 정보를 전달하기 위한 DTO
export type ProductDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  likes: number | null;
  tags: string[];
};

// 상품 상세 정보를 작성자 정보와 함께 전달하기 위한 상품 생성 DTO
export type ProductCreateDto = Omit<ProductDto, "id"> & {
  userId: UserParamsDto["id"];
};

export type ProductParamsDto = {
  id: string;
};
