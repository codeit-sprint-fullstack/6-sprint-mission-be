import { Prisma } from "@prisma/client";

export type TArticleUser = {
    userId: number;
}

export type TArticle = {
    articleId: number;
    title: string;
    content: string;
    image:  string | null;
    cursor?: number | undefined;
    limit?: number | undefined;
    take?: number | undefined;
    orderBy? : 'favorite' | 'recent';
    keyword? : string | undefined;
}