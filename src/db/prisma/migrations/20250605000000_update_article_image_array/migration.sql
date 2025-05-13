/*
  이미지 필드를 배열로 변경
*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "image",
ADD COLUMN "image" TEXT[]; 