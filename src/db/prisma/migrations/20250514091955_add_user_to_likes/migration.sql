/*
  Warnings:

  - Added the required column `userId` to the `LikeToArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LikeToProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LikeToArticle" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LikeToProduct" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LikeToProduct" ADD CONSTRAINT "LikeToProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeToArticle" ADD CONSTRAINT "LikeToArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
