import { prismaClient } from '../../infra/prismaClient';

import { Article } from '../../domain/Article';
import { User } from '../../domain/User';
import { Like } from '../../domain/Like';
import { TArticle, TArticleUser } from '@/types/article';
import { Prisma } from '@prisma/client';

type TetArticleList = {
    cursor?: number | undefined;
    limit?: number | undefined;
    orderBy? : 'favorite' | 'recent';
    keyword? : string | undefined;
}

export class GetArticleListHandler {
    static async handle(requester: TArticleUser, { cursor, limit, orderBy, keyword } : TetArticleList) {
        const orderByOption =
            orderBy === 'favorite'
                ? { _count: { likes: 'desc' as Prisma.SortOrder } }
                : { createdAt: 'desc' as Prisma.SortOrder };

        const articleEntities = await prismaClient.article.findMany({
            cursor: cursor
                ? {
                    id: cursor,
                }
                : undefined,
            take: Number(limit) + 1,
            orderBy: orderByOption,
            where: {
                title: keyword ? { contains: keyword } : undefined,
            },
        });

        const articles = articleEntities.map(
            (articleEntity) => new Article(articleEntity)
        );

        const writerEntities = await prismaClient.user.findMany({
            where: {
                id: {
                    in: Array.from(
                        new Set(articles.map((article) => article.getWriterId()))
                    ),
                },
            },
        });

        const writers = writerEntities.map(
            (writerEntity) => new User(writerEntity)
        );

        const likeEntities = await prismaClient.like.findMany({
            where: {
                userId: requester.userId,
                articleId: {
                    in: Array.from(new Set(articles.map((article) => article.getId()))),
                },
            },
        });

        const likes = likeEntities.map((likeEntity) => new Like({
            id: likeEntity.id,
            userId: likeEntity.userId,
            productId: likeEntity.productId ?? 0,
            articleId: likeEntity.articleId ?? 0,
            createdAt: likeEntity.createdAt ?? new Date(),
        }));

        const hasNext = articles.length === Number(limit) + 1;

        return {
            list: articles.slice(0, limit).map((article) => {
                const writer = writers.find(
                    (writer) => writer.getId() === article.getWriterId()
                );
                const like = likes.find(
                    (like) => like.getArticleId() === article.getId()
                );
                if(!writer) {
                    throw new Error('작성자를 찾을 수 없습니다.')
                }
                return {
                    id: article.getId(),
                    writer: {
                        id: writer.getId(),
                        nickname: writer.getNickname(),
                    },
                    title: article.getTitle(),
                    content: article.getContent(),
                    image: article.getImage(),
                    createdAt: article.getCreatedAt(),
                    isFavorite: !!like,
                };
            }),
            nextCursor: hasNext ? articles[articles.length - 1].getId() : null,
        };
    }
}
