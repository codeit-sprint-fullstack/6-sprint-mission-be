import { prismaClient } from '../prismaClient.js';

export async function Create(data) {
    return prismaClient.comment.create({ data });
}

export async function Update(id, data) {
    return prismaClient.$transaction(async (tx) => {
        const comment = await tx.comment.findUnique({ where: { id } });
        if (!comment) throw new Error('comment not found');
        return tx.comment.update({
            where: { id },
            data,
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                writer: {
                    select: {
                        id: true,
                        nickname: true,
                        image: true,
                    },
                },
            },
        });
    });
}
export async function Delete(id) {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.comment.findUnique({ where: { id } });
        if (!exists) throw new Error('Comment not found');

        await tx.comment.delete({ where: { id } });
        return { id }; // 삭제된 ID만 반환
    });
}

export async function fetchComments({ type, targetId, cursor, limit = 10 }) {
    const key = type === 'article' ? 'articleId' : 'productId';

    const comments = await prismaClient.comment.findMany({
        where: {
            [key]: targetId,
        },
        orderBy: { id: 'asc' },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            writer: {
                select: {
                    id: true,
                    nickname: true,
                    image: true,
                },
            },
        },
    });

    const hasNext = comments.length > limit;
    const resultList = hasNext ? comments.slice(0, limit) : comments;

    return {
        nextCursor: hasNext ? comments[comments.length - 1].id : null,
        list: resultList,
    };
}
