export type CreateUserDto = {
    email: string;
    password: string;
    repeatpassowrd: string;
    nickname: string;
    img?: string;
    token?: string;
};

export type LoginUserDto = {
    email: string;
    password: string;
};

export type UserInfoDto = {
    email: string;
    nickname: string;
};
