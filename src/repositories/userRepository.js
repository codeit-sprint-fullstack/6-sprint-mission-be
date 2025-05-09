import bcrypt from 'bcrypt';
import { prismaClient } from '../prismaClient.js';

// id 값으로 유저 찾기
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

// 회원 정보 수정용
export async function update(id, data) {
    // 비밀번호 수정 요청 시  해싱 처리
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prismaClient.user.update({
        where: { id },
        data: data,
    });
}
