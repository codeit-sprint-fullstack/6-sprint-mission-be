import { Article } from '@prisma/client';
import { HttpError } from '../middlewares/HttpError.js';
import * as articleRepository from '../repositories/articleRepository.js';
import * as commentRepository from '../repositories/commentRepository.js';

export const createArticle = async (data: Pick<Article, 'title' | 'content'>, userId: number) => {
    const entity = await articleRepository.Create({
        ...data,
        authorId: userId,
    });

    return {
        id: entity.id,
        title: entity.title,
        content: entity.content,
        image: entity.image,
        likeCount: entity.likeCount,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        writer: {
            id: entity.author.id,
            nickname: entity.author.nickname,
        },
    };
};

export const getArticle = async (id: number) => {
    const entity = await articleRepository.FindById(id);
    if (!entity) throw new HttpError(404, '게시글이 존재하지 않습니다');

    return {
        id: entity.id,
        title: entity.title,
        content: entity.content,
        createdAt: entity.createdAt,
        authorNickname: entity.author.nickname,
        likeCount: entity.likeCount,
    };
};

export const getArticles = async ({
    cursor,
    take,
    orderBy,
    word,
}: {
    orderBy?: string;
    take: number;
    cursor?: number;
    word?: string;
}) => {
    const safeTake = Number(take ?? 10); // 기본값 10 지정 + 숫자 변환

    const entities = await articleRepository.FindMany({
        cursor,
        take: safeTake,
        orderBy,
        word,
    });

    const hasNext = entities.length === safeTake + 1;

    return {
        data: entities.slice(0, safeTake).map((a) => ({
            id: a.id,
            title: a.title,
            content: a.content,
            createdAt: a.createdAt,
            authorNickname: a.author.nickname,
            likeCount: a.likeCount,
        })),
        hasNext,
        nextCursor: hasNext ? entities[entities.length - 1].id : null,
    };
};

export const updateArticle = async (id: number, data: Pick<Article, 'title' | 'content'>) => {
    const entity = await articleRepository.Update(id, data);
    if (!entity) throw new HttpError(404, '게시글이 존재하지 않습니다');
    return {
        id: entity.id,
        title: entity.title,
        content: entity.content,
        createdAt: entity.createdAt,
        authorNickname: entity.author.nickname,
        likeCount: entity.likeCount,
    };
};

export const deleteArticle = async (id: number) => {
    const entity = await articleRepository.FindById(id);
    if (!entity) throw new HttpError(404, '게시글이 존재하지 않습니다');
    await articleRepository.Delete(id);
};

// export const createComment = async (articleId: number, content: string) => {
//     const entity = await commentRepository.Create(articleId, content);
//     return {
//         id: entity.id,
//         content: entity.content,
//         createdAt: entity.createdAt,
//     };
// };

// export const listComments = async (
//     articleId: number,
//     {
//         type,
//         tableId,
//         cursor,
//         limit = 10,
//     }: {
//         type: string;
//         tableId: number;
//         cursor?: number;
//         limit?: number;
//     },
// ) => {
//     const entities = await commentRepository.fetchComments(articleId, { cursor, take });

//   const take = limit; // ✅ 누락된 변수 정의
//     const hasNext = entities.length === take + 1;
//     return {
//         data: entities.slice(0, take).map((c) => ({
//             id: c.id,
//             articleId: c.articleId,
//             content: c.content,
//             createdAt: c.createdAt,
//         })),
//         hasNext,
//         nextCursor: hasNext ? entities[entities.length - 1].id : null,
//     };
// };
export const toggleLike = async (articleId: number, userId: number) => {
    const result = await articleRepository.toggleLike(userId, articleId);
    return result;
};
