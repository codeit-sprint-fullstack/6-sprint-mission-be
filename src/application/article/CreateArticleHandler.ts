import { prismaClient } from '../../infra/prismaClient.js';

import { Article } from '../../domain/Article.js';
import { User } from '../../domain/User.js';

import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

interface IRequester {
  userId: number;
}

interface ICreateArticleDTO {
  title: string;
  content: string;
  image?: string | null;
}

export class CreateArticleHandler {
    static async handle(requester: IRequester, { title, content, image }: ICreateArticleDTO) {
        const articleEntity = await prismaClient.article.create({
            data: {
                writerId: requester.userId,
                title,
                content,
                image,
            },
        });

        /**
         * [클래스 객체로 변환]
         *
         * articleEntity 는 Article 클래스의 인스턴스가 아니므로,
         * Article 클래스에 정의된 메서드를 사용할 수 없습니다.
         */
        const article = new Article({
          ...articleEntity,
          likes: [],
        });

        const writerEntity = await prismaClient.user.findUnique({
            where: {
                id: article.getWriterId(),
            },
        });

        if (!writerEntity) {
          throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
        }

        const writer = new User(writerEntity);

        return {
            id: article.getId(),
            writer: {
                id: writer.getId(),
                nickname: writer.getNickname(),
                image: writer.getImage(),
            },
            title: article.getTitle(),
            content: article.getContent(),
            image: article.getImage(),
            createdAt: article.getCreatedAt(),
            updatedAt: article.getUpdatedAt(),
        };
    }
}
