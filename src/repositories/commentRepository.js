import { prismaClient } from '../prismaClient.js';

export async function getById(id) {
    return prismaClient.comment.findUnique({
        where: { id },
        select: {
            id: true,
            content: true,
            userId: true,
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
}

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

export async function fetchComments({ type, tableId, cursor, limit = 10 }) {
    const comments = await prismaClient.comment.findMany({
        where: {
            type,
            tableId,
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

    return comments;
}
