/*
  Warnings:

  - You are about to drop the column `boardType` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boardType` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_productId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "boardType" TEXT NOT NULL,
ADD COLUMN     "intro" TEXT,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "boardType",
DROP COLUMN "productId";

-- DropTable
DROP TABLE "Product";
