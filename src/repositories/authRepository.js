import { prismaClient } from '../prismaClient.js';
import bcrypt from 'bcrypt';

// id 값으로 유저 찾기-
export async function findById(id) {
    return prismaClient.user.findUnique({
        where: { id },
    });
}

// email 값으로 유저 찾기 (로그인용)
export async function findByEmail(email) {
    return prismaClient.user.findUnique({
        where: { email },
    });
}

// 토큰 으로 유저 찾기
export async function findByToken(token) {
    return prismaClient.user.findUnique({
        where: { token },
    });
}

// 회원 가입용 (비밀번호 bcrypt로 해싱 후 저장)
export async function save(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return prismaClient.user.create({
        data: {
            nickname: user.nickname,
            email: user.email,
            password: hashedPassword,
        },
    });
}

//  토큰 정보 업데이트 (리프레시 토큰 저장)
export async function update(id, data) {
    return prismaClient.user.update({
        where: { id },
        data,
    });
}

// 소셜 로그인용
export async function createOrUpdate(provider, providerId, email, name) {
    return prismaClient.user.upsert({
        where: { provider, providerId },
        update: { email, name },
        create: { provider, providerId, email, name },
    });
}
