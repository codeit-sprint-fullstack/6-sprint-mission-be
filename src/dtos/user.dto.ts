// 클라이언트에게 사용자 정보를 안전하게 전달하기 위한 DTO (비밀번호, refreshToken 등 민감한 정보 제외)

// 클라이언트에서 받는거만 DTO로 쓰기

export type UserDto = {
  id: string;
  email: string;
  encryptedPassword: string;
  refreshToken: string | null;
  nickname: string;
  image: string | null;
};

export type UserFilteredDto = Omit<
  UserDto,
  "encryptedPassword" | "refreshToken"
>;

export type UserSignInDto = {
  email: string;
  password: string;
};

export type UserSignUpDto = {
  nickname: string;
  email: string;
  password: string;
};

export type UserSaveDto = {
  nickname: string;
  email: string;
  encryptedPassword: string;
};

export type UserUpdateDto = {
  nickname: string;
  email: string;
  encryptedPassword: string;
  refreshToken: string;
};

// 사용자 프로필 요약 정보를 전달하기 위한 DTO (게시글, 댓글 등에서 작성자 정보 표시용)
export type UserSummaryDto = {
  id: string;
  nickname: string;
  image: string | null;
};

export type UserParamsDto = {
  id: string;
};
