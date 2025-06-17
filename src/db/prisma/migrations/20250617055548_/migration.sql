/*
  Warnings:

  - You are about to drop the column `image` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - Made the column `likes` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `likes` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[],
ALTER COLUMN "likes" SET NOT NULL,
ALTER COLUMN "likes" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[],
ALTER COLUMN "likes" SET NOT NULL,
ALTER COLUMN "likes" SET DEFAULT 0;
