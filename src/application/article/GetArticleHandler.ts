import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { Article } from '../../domain/Article';
import { User } from '../../domain/User';
import { TArticle, TArticleUser } from '@/types/article';

type TGetArticle = {
    articleId: number;
}

export class GetArticleHandler {
    static async handle(requester: TArticleUser, { articleId } : TGetArticle) {
        const articleEntity = await prismaClient.article.findUnique({
            where: {
                id: Number(articleId), // params 에서 가져온 값은 문자열이므로, 여기서는 숫자로 변환하여 사용해야 합니다.
            },
            include: {
                likes: {
                    select: {
                        // 좋아요의 id, userId만 필요함
                        id: true,
                        userId: true,
                    },
                },
            },
        });

        if (!articleEntity) {
            throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
        }

        const article = new Article(articleEntity);

        const writerEntity = await prismaClient.user.findUnique({
            where: {
                id: article.getWriterId(),
            },
        });

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
            favoriteCount: article.getFavoriteCount(),
            isFavorite: article.getIsFavorite(requester.userId),
        };
    }
}
