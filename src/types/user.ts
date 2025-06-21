export type TUserParam = {
    id: number;
    email: string;
    password: string;
    nickname: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
} 