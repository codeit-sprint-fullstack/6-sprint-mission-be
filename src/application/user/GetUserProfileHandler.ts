import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { User } from '../../domain/User';

type TGetUserProfile = {
    userId : number;
}

export class GetUserProfileHandler {
    static async handle(requester : TGetUserProfile) {
        const userEntity = await prismaClient.user.findUnique({
            where: {
                id: requester.userId,
            },
        });
        if (!userEntity) {
            throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
        }

        const user = new User(userEntity);

        return {
            id: user.getId(),
            email: user.getEmail(),
            nickname: user.getNickname(),
            image: user.getImage(),
            createdAt: user.getCreatedAt(),
            updatedAt: user.getUpdatedAt(),
        };
    }
}
