/*
  Warnings:

  - You are about to drop the column `authorId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `ArticleComment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `ProductComment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProductLike` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductComment" DROP CONSTRAINT "ProductComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductLike" DROP CONSTRAINT "ProductLike_userId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "ArticleComment" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "ProductComment" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "ProductLike" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
