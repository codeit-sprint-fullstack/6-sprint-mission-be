import { prismaClient } from '../../infra/prismaClient';

import { Article } from '../../domain/Article';
import { User } from '../../domain/User';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';
import { TArticle, TArticleUser } from '@/types/article';

type DeleteArticleLike = {
    articleId: number;
}

export class DeleteArticleLikeHandler {
    static async handle(requester: TArticleUser, { articleId } : DeleteArticleLike) {
        const articleEntity = await prismaClient.$transaction(async (tx) => {
            const targetArticleEntity = await tx.article.findUnique({
                where: {
                    id: articleId,
                },
            });

            if (!targetArticleEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
            }

            const likeEntity = await tx.like.findUnique({
                where: {
                    userId_articleId: {
                        userId: requester.userId,
                        articleId,
                    },
                },
            });

            if (likeEntity) {
                await tx.like.delete({
                    where: {
                        userId_articleId: {
                            userId: requester.userId,
                            articleId,
                        },
                    },
                });
            }

            return targetArticleEntity;
        });

        const article = new Article(articleEntity);

        const writerEntity = await prismaClient.user.findUnique({
            where: {
                id: articleEntity.writerId,
            },
        });

        if(!writerEntity) {
            throw new Error('User Not Found')
        }
        
        const writer = new User(writerEntity);

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
            isFavorite: false,
        };
    }
}
