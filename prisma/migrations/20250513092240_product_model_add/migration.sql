-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "favoriteCount" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "images" TEXT[],
    "tags" TEXT[],
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
