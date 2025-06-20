-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "nickName" DROP NOT NULL,
ALTER COLUMN "encryptedPassword" DROP NOT NULL;
