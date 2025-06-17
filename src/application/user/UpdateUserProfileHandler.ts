import { prismaClient } from '../../infra/prismaClient';

import { NotFoundException } from '../../exceptions/NotFoundException';
import { ExceptionMessage } from '../../constant/ExceptionMessage';

import { User } from '../../domain/User';

type TUpdateUserProfileUser = {
    userId: number;
}

export class UpdateUserProfileHandler {
    static async handle(requester: TUpdateUserProfileUser, { image }: { image?: string | null }) {
        const userEntity = await prismaClient.user.findUnique({
            where: {
                id: requester.userId,
            },
        });
        if (!userEntity) {
            throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
        }

        const user = new User(userEntity);
        user.setImage(image);
        
        await prismaClient.user.update({
            where: {
                id: user.getId(),
            },
            data: {
                image: user.getImage(),
            },
        });

        return {
            user: {
                id: user.getId(),
                email: user.getEmail(),
                nickname: user.getNickname(),
                image: user.getImage(),
                createdAt: user.getCreatedAt(),
                updatedAt: user.getUpdatedAt(),
            },
        };
    }
}
