/*
  Warnings:

  - You are about to drop the column `Tags` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "Tags",
ADD COLUMN     "tags" TEXT[];
