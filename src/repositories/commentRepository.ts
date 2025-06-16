import { Comment } from '@prisma/client';
import { prismaClient } from '../prismaClient';

export async function getById(id: number) {
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

export async function Create(data: {
    content: string;
    articleId?: number;
    productId?: number;
    userId: number;
    tableId: number;
    type: string;
}) {
    return prismaClient.comment.create({ data });
}

export async function Update(id: number, data: string) {
    return prismaClient.$transaction(async (tx) => {
        const comment = await tx.comment.findUnique({ where: { id } });
        if (!comment) throw new Error('comment not found');
        return tx.comment.update({
            where: { id },
            data: { content: data },
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
export async function Delete(id: number) {
    return prismaClient.$transaction(async (tx) => {
        const exists = await tx.comment.findUnique({ where: { id } });
        if (!exists) throw new Error('Comment not found');

        await tx.comment.delete({ where: { id } });
        return { id }; // 삭제된 ID만 반환
    });
}

export async function fetchComments({
    type,
    tableId,
    cursor,
    limit = 10,
}: {
    type: string;
    tableId: number;
    cursor?: number;
    limit?: number;
}) {
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
