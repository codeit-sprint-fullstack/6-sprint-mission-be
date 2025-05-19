/*
  Warnings:

  - Made the column `authorId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `ProductComment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductComment" ALTER COLUMN "authorId" SET NOT NULL;
