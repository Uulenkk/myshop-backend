-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Ready', 'Preorder', 'Brand');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "ProductType";

-- CreateTable
CREATE TABLE "ProductSize" (
    "id" SERIAL NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "measurements" JSONB NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
