"use strict";
// prisma/seed.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt")); // 비밀번호 해싱을 위해 bcrypt 필요
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding started...');
    // 1. 사용자 생성 (비밀번호 해싱 포함)
    const hashedPassword1 = await bcrypt_1.default.hash('password123', 10);
    const hashedPassword2 = await bcrypt_1.default.hash('securepass', 10);
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
            nickname: '개발자김',
            email: 'user1@example.com',
            password: hashedPassword1,
        },
    });
    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            nickname: '디자이너이',
            email: 'user2@example.com',
            password: hashedPassword2,
        },
    });
    console.log(`Created users: ${user1.nickname}, ${user2.nickname}`);
    // 2. 태그 생성
    const tag1 = await prisma.tag.upsert({
        where: { name: '전자제품' },
        update: {},
        create: { name: '전자제품' },
    });
    const tag2 = await prisma.tag.upsert({
        where: { name: '의류' },
        update: {},
        create: { name: '의류' },
    });
    const tag3 = await prisma.tag.upsert({
        where: { name: '도서' },
        update: {},
        create: { name: '도서' },
    });
    console.log(`Created tags: ${tag1.name}, ${tag2.name}, ${tag3.name}`);
    // 3. 상품 생성 (사용자에게 연결)
    const product1 = await prisma.product.upsert({
        where: { id: 1 }, // upsert를 위해 고유한 필드를 사용하거나, 없으면 임의의 id
        update: {
            name: '노트북 (새로운 버전)', // 업데이트 시 변경될 내용
        },
        create: {
            name: '새로운 노트북',
            price: 1200.0,
            userId: user1.id, // user1에 속하는 상품
            tags: {
                create: [{ tagId: tag1.id }], // 전자제품 태그 연결
            },
        },
    });
    const product2 = await prisma.product.upsert({
        where: { id: 2 },
        update: {
            name: '빈티지 티셔츠',
        },
        create: {
            name: '빈티지 티셔츠',
            price: 25.5,
            userId: user2.id, // user2에 속하는 상품
            tags: {
                create: [{ tagId: tag2.id }], // 의류 태그 연결
            },
        },
    });
    console.log(`Created products: ${product1.name}, ${product2.name}`);
    // 4. 댓글 생성 (사용자와 상품에 연결)
    const comment1 = await prisma.comment.upsert({
        where: { id: 1 },
        update: {},
        create: {
            content: '이 노트북 정말 좋아요!',
            userId: user2.id,
            productId: product1.id,
        },
    });
    const comment2 = await prisma.comment.upsert({
        where: { id: 2 },
        update: {},
        create: {
            content: '티셔츠 색상이 예쁘네요.',
            userId: user1.id,
            productId: product2.id,
        },
    });
    console.log(`Created comments: "${comment1.content}", "${comment2.content}"`);
    // 5. 게시글 (Article) 생성 (작성자에 연결)
    const article1 = await prisma.article.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: '첫 번째 개발 일기',
            content: 'Prisma와 함께하는 개발은 즐거워요.',
            writer: user1.nickname, // User의 닉네임을 writer로 사용
            userId: user1.id,
        },
    });
    const article2 = await prisma.article.upsert({
        where: { id: 2 },
        update: {},
        create: {
            title: '디자인 트렌드 분석',
            content: '2025년 최신 디자인 트렌드를 알아봅시다.',
            writer: user2.nickname,
            userId: user2.id,
        },
    });
    console.log(`Created articles: "${article1.title}", "${article2.title}"`);
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
