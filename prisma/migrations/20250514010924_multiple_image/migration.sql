/*
  Warnings:

  - You are about to drop the column `image` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
