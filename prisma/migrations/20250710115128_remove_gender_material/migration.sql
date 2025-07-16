/*
  Warnings:

  - You are about to drop the column `gender` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "gender",
DROP COLUMN "material",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
