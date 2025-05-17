/*
  Warnings:

  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - Added the required column `nickName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "nickname",
ADD COLUMN     "nickName" VARCHAR(10) NOT NULL;
