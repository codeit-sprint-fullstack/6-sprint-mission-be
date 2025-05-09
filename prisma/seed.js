import { PrismaClient } from '@prisma/client';
import { ArticleMocks } from './mocks/articleMocks.js';
import { ProductMocks } from './mocks/productMocks.js';
import { CommentMocks } from './mocks/commentMocks.js';
import { UserMocks } from './mocks/userMocks.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 기존 데이터 삭제 (주의: 관계 순서 맞추기)
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // User 생성
    const createdUsers = [];
    for (const user of UserMocks) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const created = await prisma.user.create({
            data: {
                nickname: user.nickname,
                email: user.email,
                image: user.image,
                password: hashedPassword,
                token: user.token,
            },
        });
        createdUsers.push(created);
    }

    // Article 생성 (user 연결 안전히)
    const createdArticles = [];
    for (const article of ArticleMocks) {
        const mappedAuthor = createdUsers[(article.authorId - 1) % createdUsers.length];
        if (!mappedAuthor) {
            throw new Error(`Author with id ${article.authorId} not found`);
        }

        const created = await prisma.article.create({
            data: {
                title: article.title,
                content: article.content,
                likeCount: article.likedCount,
                image: article.image,
                authorId: mappedAuthor.id,
            },
        });
        createdArticles.push(created);
    }

    // Product 생성 (user 연결 안전히)
    const createdProducts = [];
    for (const product of ProductMocks) {
        const mappedOwner = createdUsers[(product.ownerId - 1) % createdUsers.length];
        if (!mappedOwner) {
            throw new Error(`Owner with id ${product.ownerId} not found`);
        }

        const created = await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                images: product.images,
                favoriteCount: product.favoriteCount,
                isFavorite: product.isFavorite,
                ownerNickname: product.ownerNickname,
                ownerId: mappedOwner.id,
            },
        });
        createdProducts.push(created);
    }

    // Comment 생성 (article/product 연결 안전히)
    for (const comment of CommentMocks) {
        const mappedWriter = createdUsers[(comment.userId - 1) % createdUsers.length];
        if (!mappedWriter) {
            throw new Error(`Writer with id ${comment.userId} not found`);
        }

        const connectData = {};
        if (comment.articleId) {
            const mappedArticle = createdArticles[(comment.articleId - 1) % createdArticles.length];
            if (!mappedArticle) {
                throw new Error(`Article with id ${comment.articleId} not found`);
            }
            connectData.articleId = mappedArticle.id;
        }
        if (comment.productId) {
            const mappedProduct = createdProducts[(comment.productId - 1) % createdProducts.length];
            if (!mappedProduct) {
                throw new Error(`Product with id ${comment.productId} not found`);
            }
            connectData.productId = mappedProduct.id;
        }

        await prisma.comment.create({
            data: {
                content: comment.content,
                userId: mappedWriter.id,
                ...connectData,
            },
        });
    }

    console.log('🌱 Seeding completed!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
