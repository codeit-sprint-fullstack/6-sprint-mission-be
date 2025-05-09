import { prismaClient } from '../prismaClient.js';

export const Create = async (data) => {
    return prismaClient.article.create({ data });
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
