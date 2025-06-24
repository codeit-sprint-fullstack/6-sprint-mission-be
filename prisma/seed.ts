import {
  Article,
  ArticleComment,
  ArticleLike,
  PrismaClient,
  Product,
  ProductComment,
  ProductLike,
  User,
} from "@prisma/client";
import {
  ARTICLE_MOCK,
  ARTICLE_COMMENT_MOCK,
  ARTICLE_LIKE_MOCK,
} from "./mock/articleMock";
import {
  PRODUCT_MOCK,
  PRODUCT_COMMENT_MOCK,
  PRODUCT_LIKE_MOCK,
} from "./mock/productMock";
import { USER_MOCK } from "./mock/userMock";

type TUser = {
  data: Pick<User, "email" | "password" | "nickname">[];
  skipDuplicates: boolean;
};

type TArticle = {
  data: Pick<Article, "title" | "content" | "authorId">[];
  skipDuplicates: boolean;
};

type TArticleComment = {
  data: Pick<ArticleComment, "content" | "articleId" | "authorId">[];
  skipDuplicates: boolean;
};

type TArticleLike = {
  data: Pick<ArticleLike, "userId" | "articleId">[];
  skipDuplicates: boolean;
};

type TProduct = {
  data: Pick<Product, "name" | "description" | "price" | "authorId">[];
  skipDuplicates: boolean;
};

type TProductComment = {
  data: Pick<ProductComment, "content" | "productId" | "authorId">[];
  skipDuplicates: boolean;
};

type TProductLike = {
  data: Pick<ProductLike, "productId" | "userId">[];
  skipDuplicates: boolean;
};

const prisma = new PrismaClient();

async function main() {
  // 데이터 초기화
  await prisma.user.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.productLike.deleteMany();

  // 시드데이터 삽입
  await prisma.user.createMany<TUser>({
    data: USER_MOCK,
    skipDuplicates: true,
  });

  await prisma.article.createMany<TArticle>({
    data: ARTICLE_MOCK,
    skipDuplicates: true,
  });

  await prisma.articleComment.createMany<TArticleComment>({
    data: ARTICLE_COMMENT_MOCK,
    skipDuplicates: true,
  });

  await prisma.articleLike.createMany<TArticleLike>({
    data: ARTICLE_LIKE_MOCK,
    skipDuplicates: true,
  });

  await prisma.product.createMany<TProduct>({
    data: PRODUCT_MOCK,
    skipDuplicates: true,
  });

  await prisma.productComment.createMany<TProductComment>({
    data: PRODUCT_COMMENT_MOCK,
    skipDuplicates: true,
  });

  await prisma.productLike.createMany<TProductLike>({
    data: PRODUCT_LIKE_MOCK,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
