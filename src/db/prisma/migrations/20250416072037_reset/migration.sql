/*
  Warnings:

  - You are about to drop the column `heartCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `heartCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "heartCount",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "heartCount",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
