/*
  Warnings:

  - Made the column `nickName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `encryptedPassword` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nickName" SET NOT NULL,
ALTER COLUMN "encryptedPassword" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
