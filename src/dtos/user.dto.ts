export type CreateUserDto = {
  email: string;
  nickname: string;
  password: string;
  image: string;
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};
