import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Article } from '../../domain/Article';
import { User } from '../../domain/User';
import { TArticleUser } from '@/types/article';

type TUpdateArticle = {
    articleId: number;
    title: string | undefined;
    content: string | undefined;
    image:  string | undefined | null;
}

export class UpdateArticleHandler {
    static async handle(requester: TArticleUser, { articleId, title, content, image } : TUpdateArticle) {
        /**
         * [게시글 수정 트랜잭션]
         *
         * 1. 게시글을 수정하기 전에 해당 게시글이 존재하는지 확인합니다.
         * 2. 게시글이 존재한다면, 게시글을 수정합니다.
         *
         * update() 하나만 사용해도 결과적으로는 동일합니다.
         */
        const articleEntity = await prismaClient.$transaction(async (tx) => {
            const targetArticleEntity = await tx.article.findUnique({
                where: {
                    id: articleId,
                },
            });

            if (!targetArticleEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
            }

            if (targetArticleEntity.writerId !== requester.userId) {
                throw new ForbiddenException('Forbidden', ExceptionMessage.FORBIDDEN);
            }

            return await tx.article.update({
                where: {
                    id: articleId,
                },
                data: {
                    title,
                    content,
                    image,
                },
            });
        });

        const article = new Article(articleEntity);

        const writerEntity = await prismaClient.user.findUnique({
            where: {
                id: article.getWriterId(),
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
        };
    }
}
