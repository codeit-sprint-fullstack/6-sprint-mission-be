import * as articleRepository from '../repositories/articleRepository.js';
import * as commentRepository from '../repositories/commentRepository.js';

export const createArticle = async (data) => {
    const entity = await articleRepository.Create(data);
    return {
        id: entity.id,
        title: entity.title,
        content: entity.content,
        createdAt: entity.createdAt,
    };
};

export const getArticle = async (id) => {
    const entity = await articleRepository.FindById(id);
    if (!entity) throw new Error('Article not found');
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
    const entities = await articleRepository.FindMany({ cursor, take, orderBy, word });
    const hasNext = entities.length === take + 1;
    return {
        data: entities.slice(0, take).map((a) => ({
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
