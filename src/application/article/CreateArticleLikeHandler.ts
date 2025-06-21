import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Article } from '../../domain/Article';
import { User } from '../../domain/User';
import { TArticle, TArticleUser } from '@/types/article';

type TCreateArticleLike = {
    articleId: number;
}


export class CreateArticleLikeHandler {
    static async handle(requester: TArticleUser, { articleId } : TCreateArticleLike) {
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

            if (!likeEntity) {
                await tx.like.create({
                    data: {
                        userId: requester.userId,
                        articleId,
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
            isFavorite: true,
        };
    }
}
