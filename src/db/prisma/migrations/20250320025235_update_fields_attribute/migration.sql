-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ArticleComment" ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductComment" ALTER COLUMN "content" DROP DEFAULT;
