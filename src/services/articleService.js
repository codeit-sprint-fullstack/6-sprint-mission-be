import { HttpError } from '../middlewares/HttpError.js';
import * as articleRepository from '../repositories/articleRepository.js';
import * as commentRepository from '../repositories/commentRepository.js';

export const createArticle = async (data, userId) => {
    console.log('서비스에서 유저아이디:', userId);
    const entity = await articleRepository.Create({
        ...data,
        authorId: userId,
    });
    console.log('생성한 entity 데이터:', entity);
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

export const getArticle = async (id) => {
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

export const getArticles = async ({ cursor, take, orderBy, word }) => {
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

export const updateArticle = async (id, data) => {
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

export const deleteArticle = async (id) => {
    const entity = await articleRepository.FindById(id);
    if (!entity) throw new HttpError(404, '게시글이 존재하지 않습니다');
    await articleRepository.Delete(id);
};

export const createComment = async (articleId, content) => {
    const entity = await commentRepository.create(articleId, content);
    return {
        id: entity.id,
        content: entity.content,
        createdAt: entity.createdAt,
    };
};

export const listComments = async (articleId, { cursor, take }) => {
    const entities = await commentRepository.findManyByArticle(articleId, { cursor, take });
    const hasNext = entities.length === take + 1;
    return {
        data: entities.slice(0, take).map((c) => ({
            id: c.id,
            articleId: c.articleId,
            content: c.content,
            createdAt: c.createdAt,
        })),
        hasNext,
        nextCursor: hasNext ? entities[entities.length - 1].id : null,
    };
};
export const toggleLike = async (articleId, userId) => {
    const result = await articleRepository.toggleLike(userId, articleId);
    return result;
};
