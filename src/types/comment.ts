export type TCommentParam = {
    id: number;
    writerId: number;
    articleId?: number | null;
    productId?: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}