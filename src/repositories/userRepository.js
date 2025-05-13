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

// 유저가 등록한 상품 가져오기
export const userProduct = async (id) => {
    return prismaClient.user.findUnique({
        where: { id },
        include: { products: true },
    });
};

// 유저가 등록한 게시글 가져오기
export const userArticles = async (id) => {
    return prismaClient.user.findUnique({
        where: { id },
        include: { articles: true },
    });
};

// 유저 좋아요목록 가져오기
export const userFavorites = async (id) => {
    return prismaClient.user.findUnique({
        where: { id },
        include: {
            myLikes: {
                include: {
                    product: true,
                    article: true,
                },
            },
        },
    });
};
