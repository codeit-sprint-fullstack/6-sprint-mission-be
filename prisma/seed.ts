import {
  Article,
  ArticleComment,
  ArticleLike,
  PrismaClient,
  Product,
  ProductComment,
  ProductImage,
  ProductLike,
  ProductTag,
  Tag,
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
  TAG_MOCK,
  PRODUCT_TAG_MOCK,
  PRODUCT_IMAGE_MOCK,
} from "./mock/productMock";
import { USER_MOCK } from "./mock/userMock";
import bcrypt from "bcrypt";

type TUser = {
  data: Pick<User, "email" | "password" | "nickname">[];
  skipDuplicates: boolean;
};

type TArticle = {
  data: Pick<Article, "title" | "content" | "authorId" | "id">[];
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
  data: Pick<Product, "name" | "description" | "price" | "authorId" | "id">[];
  skipDuplicates: boolean;
};

type TTag = {
  data: Pick<Tag, "name" | "id">[];
  skipDuplicates: boolean;
};

type TProductTag = {
  data: Pick<ProductTag, "productId" | "tagId">[];
  skipDuplicates: boolean;
};

type TProductImage = {
  data: Pick<ProductImage, "imageUrl" | "productId" | "userId">[];
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
  console.log("데이터 초기화🧹");

  // 데이터 초기화
  await prisma.user.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.productLike.deleteMany();
  await prisma.productImage.deleteMany();

  console.log("시드 데이터 추가📦");

  const users = await Promise.all(
    USER_MOCK.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  // 시드데이터 삽입
  await prisma.user.createMany<TUser>({
    data: users,
    skipDuplicates: true,
  });

  // 유저 id 가져오기
  const allUsers = await prisma.user.findMany({
    select: { id: true },
  });

  const articles = ARTICLE_MOCK.map((article, i) => ({
    ...article,
    authorId: allUsers[i].id,
  }));

  await prisma.article.createMany<TArticle>({
    data: articles,
    skipDuplicates: true,
  });

  const articleComments = ARTICLE_COMMENT_MOCK.map((articleComment, i) => ({
    ...articleComment,
    authorId: allUsers[i].id,
  }));

  await prisma.articleComment.createMany<TArticleComment>({
    data: articleComments,
    skipDuplicates: true,
  });

  const articleLikes = ARTICLE_LIKE_MOCK.map((articleLike, i) => ({
    ...articleLike,
    userId: allUsers[i].id,
  }));

  await prisma.articleLike.createMany<TArticleLike>({
    data: articleLikes,
    skipDuplicates: true,
  });

  const products = PRODUCT_MOCK.map((product, i) => ({
    ...product,
    authorId: allUsers[i].id,
  }));

  await prisma.product.createMany<TProduct>({
    data: products,
    skipDuplicates: true,
  });

  await prisma.tag.createMany<TTag>({
    data: TAG_MOCK,
    skipDuplicates: true,
  });

  await prisma.productTag.createMany<TProductTag>({
    data: PRODUCT_TAG_MOCK,
    skipDuplicates: true,
  });

  const productComments = PRODUCT_COMMENT_MOCK.map((productComment, i) => ({
    ...productComment,
    authorId: allUsers[i].id,
  }));

  await prisma.productComment.createMany<TProductComment>({
    data: productComments,
    skipDuplicates: true,
  });

  const productLikes = PRODUCT_LIKE_MOCK.map((productLike, i) => ({
    ...productLike,
    userId: allUsers[i].id,
  }));

  await prisma.productLike.createMany<TProductLike>({
    data: productLikes,
    skipDuplicates: true,
  });

  const productImages = PRODUCT_IMAGE_MOCK.map((productImage, i) => ({
    ...productImage,
    userId: allUsers[i].id,
  }));

  await prisma.productImage.createMany<TProductImage>({
    data: productImages,
    skipDuplicates: true,
  });

  console.log("Seeding 완료✅");
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
