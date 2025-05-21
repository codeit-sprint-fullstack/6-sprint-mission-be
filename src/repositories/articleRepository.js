import { prismaClient } from '../prismaClient.js';

export const Create = async (data) => {
    return prismaClient.article.create({
        data,
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });
};

export const FindById = async (id) => {
    return prismaClient.article.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });
};

export const Update = async (id, data) => {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.article.findUnique({ where: { id } });
        if (!exists) throw new Error('Article not found');
        return tx.article.update({
            where: { id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
    });
};

export const Delete = async (id) => {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.article.findUnique({ where: { id } });
        if (!exists) throw new Error('Article not found');
        return tx.article.delete({ where: { id } });
    });
};

export const FindMany = async ({ cursor, take, orderBy, word }) => {
    return prismaClient.article.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: take + 1,
        orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
        where: word ? { title: { contains: word } } : undefined,
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });
};
export const toggleLike = async (userId, articleId) => {
    return prismaClient.$transaction(async (tx) => {
        const existing = await tx.myLikes.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });

        if (existing) {
            // 좋아요 취소
            await tx.myLikes.delete({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            });

            await tx.article.update({
                where: { id: articleId },
                data: { likeCount: { decrement: 1 } },
            });

            return { liked: false };
        } else {
            // 좋아요 추가
            await tx.myLikes.create({
                data: {
                    userId,
                    articleId,
                    type: 'article',
                    tableId: articleId,
                },
            });

            await tx.article.update({
                where: { id: articleId },
                data: { likeCount: { increment: 1 } },
            });

            return { liked: true };
        }
    });
};
