/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `type` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProductSize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ProductSize";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "ProductType";

-- DropEnum
DROP TYPE "UserRole";
