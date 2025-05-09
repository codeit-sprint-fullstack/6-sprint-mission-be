import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';

// id 값으로 유저 찾기-
async function findById(id) {
    return prisma.user.findUnique({
        where: { id },
    });
}

// email 값으로 유저 찾기 (로그인용)
async function findByEmail(email) {
    return prisma.user.findUnique({
        where: { email },
    });
}

// 토큰 으로 유저 찾기
async function findByToken(token) {
    return prisma.user.findUnique({
        where: { token },
    });
}

// 회원 가입용 (비밀번호 bcrypt로 해싱 후 저장)
async function save(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return prisma.user.create({
        data: {
            nickname: user.nickname,
            email: user.email,
            password: hashedPassword,
        },
    });
}

//  토큰 정보 업데이트 (리프레시 토큰 저장)
async function update(id, data) {
    return prisma.user.update({
        where: { id },
        data,
    });
}

// 소셜 로그인용
async function createOrUpdate(provider, providerId, email, name) {
    return prisma.user.upsert({
        where: { provider, providerId },
        update: { email, name },
        create: { provider, providerId, email, name },
    });
}

export default {
    findById,
    findByEmail,
    findByToken,
    save,
    update,
    createOrUpdate,
};
