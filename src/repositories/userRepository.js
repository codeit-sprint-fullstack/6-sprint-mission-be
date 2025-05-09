import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';

// id 값으로 유저 찾기
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

// 회원 정보 수정용
async function update(id, data) {
    // 비밀번호 수정 요청 시 해싱 처리
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
        where: { id },
        data: data,
    });
}

export default {
    findById,
    findByEmail,
    update,
};
